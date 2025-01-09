const dbConnection = require("../config/db");

exports.getAllRequests = async () => {
  const sql = "SELECT * FROM refund_return";
  const [data] = await dbConnection.promise().query(sql);
  return data;
};

exports.getRequestById = async (requestId) => {
  const sql = "SELECT * FROM refund_return WHERE rr_id = ?";
  const [data] = await dbConnection.promise().query(sql, [requestId]);
  return data[0];
};

exports.updateRequest = async (requestId, adminId, requestData) => {
  const {
    requestType,
    requestReason,
    requestImage,
    requestStatus,
    salesOrderId,
  } = requestData;

  const isRequestLockedQuery =
    "SELECT is_request_locked FROM refund_return WHERE rr_id = ?";
  const [requestLockResult] = await dbConnection
    .promise()
    .query(isRequestLockedQuery, [requestId]);
  const isRequestLocked = requestLockResult[0].is_request_locked;

  if (isRequestLocked && requestStatus !== "Pending") {
    throw new Error("Order is locked.");
  }

  const updateQuery = `
    UPDATE refund_return
    SET
      rr_type = ?,
      rr_reason = ?,
      rr_imageProof = ?,
      rr_status = ?,
      is_request_locked = CASE
        WHEN ? = 'Approved' THEN 1
        WHEN ? = 'Declined' THEN 1
        ELSE is_request_locked
      END,
      so_id_fk = ?
    WHERE rr_id = ?
  `;

  const updateValues = [
    requestType,
    requestReason,
    requestImage,
    requestStatus,
    requestStatus,
    requestStatus,
    salesOrderId,
    requestId,
  ];

  if (requestStatus === "Approved" && !isRequestLocked) {
    const requestLogQuery =
      "INSERT INTO request_logs (request_id_fk, admin_id_fk, request_log_message) VALUES (?, ?, ?);";
    const [requestLogResult] = await dbConnection
      .promise()
      .query(requestLogQuery, [requestId, adminId, "Request Approved"]);

    const requestLogId = requestLogResult.insertId;
    await dbConnection
      .promise()
      .query("UPDATE refund_return SET request_log_id_fk = ? WHERE rr_id = ?", [
        requestLogId,
        requestId,
      ]);

    if (requestType === "Refund") {
      await dbConnection
        .promise()
        .query(
          "UPDATE sales_order SET so_paymentStatus = 'Refunded', so_orderStatus = 'Delivered' WHERE so_id = ?",
          [salesOrderId]
        );
    } else if (requestType === "Return") {
      const originalSalesOrderQuery =
        "SELECT * FROM sales_order WHERE so_id = ?";
      const [originalSalesOrderResult] = await dbConnection
        .promise()
        .query(originalSalesOrderQuery, [salesOrderId]);

      const originalSalesOrder = originalSalesOrderResult[0];
      const originalSalesOrderItemsQuery =
        "SELECT * FROM sales_order_item WHERE so_id_fk = ?";
      const [originalSalesOrderItemsResult] = await dbConnection
        .promise()
        .query(originalSalesOrderItemsQuery, [salesOrderId]);

      const originalSalesOrderItems = originalSalesOrderItemsResult;
      const originalShippingQuery =
        "SELECT * FROM shipping WHERE shipping_id = ?";
      const [originalShippingResult] = await dbConnection
        .promise()
        .query(originalShippingQuery, [originalSalesOrder.shipping_id_fk]);

      const originalShipping = originalShippingResult[0];
      const originalShippingAddressQuery =
        "SELECT * FROM shipping_address WHERE shipping_address_id = ?";
      const [originalShippingAddressResult] = await dbConnection
        .promise()
        .query(originalShippingAddressQuery, [
          originalShipping.shipping_address_id_fk,
        ]);

      const originalShippingAddress = originalShippingAddressResult[0];

      const createNewSalesOrderQuery = `
        INSERT INTO sales_order (
          so_orderDate,
          so_totalAmount,
          so_paymentMethod,
          so_paymentStatus,
          so_orderStatus,
          so_orderNotes,
          shipping_id_fk,
          customer_account_id_fk
        )
        VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?)
      `;

      const createNewSalesOrderValues = [
        originalSalesOrder.so_totalAmount,
        originalSalesOrder.so_paymentMethod,
        "Paid",
        "Processing",
        originalSalesOrder.so_orderNotes,
        null,
        originalSalesOrder.customer_account_id_fk,
      ];

      const [newSalesOrderResult] = await dbConnection
        .promise()
        .query(createNewSalesOrderQuery, createNewSalesOrderValues);

      const newSalesOrderId = newSalesOrderResult.insertId;

      await dbConnection
        .promise()
        .query(
          "UPDATE sales_order SET so_orderStatus = 'Returned' WHERE so_id = ?",
          [salesOrderId]
        );

      for (const originalItem of originalSalesOrderItems) {
        const createNewSalesOrderItemQuery = `
          INSERT INTO sales_order_item (
            so_item_quantity,
            so_item_unitPrice,
            so_item_jewelryChain,
            so_item_jewelryLength,
            so_item_jewelryTextFront,
            so_item_jewelryTextBack,
            so_item_jewelryFont,
            so_id_fk,
            product_id_fk
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const createNewSalesOrderItemValues = [
          originalItem.so_item_quantity,
          originalItem.so_item_unitPrice,
          originalItem.so_item_jewelryChain,
          originalItem.so_item_jewelryLength,
          originalItem.so_item_jewelryTextFront,
          originalItem.so_item_jewelryTextBack,
          originalItem.so_item_jewelryFont,
          newSalesOrderId,
          originalItem.product_id_fk,
        ];

        await dbConnection
          .promise()
          .query(createNewSalesOrderItemQuery, createNewSalesOrderItemValues);
      }

      const createNewShippingAddressQuery = `
        INSERT INTO shipping_address (
          shipping_address_firstName,
          shipping_address_lastName,
          shipping_address_emailAddress,
          shipping_address_contactNum,
          shipping_address_streetOne,
          shipping_address_streetTwo,
          shipping_address_city,
          shipping_address_province,
          shipping_address_zipCode,
          customer_account_id_fk
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [newShippingAddressResult] = await dbConnection
        .promise()
        .query(createNewShippingAddressQuery, [
          originalShippingAddress.shipping_address_firstName,
          originalShippingAddress.shipping_address_lastName,
          originalShippingAddress.shipping_address_emailAddress,
          originalShippingAddress.shipping_address_contactNum,
          originalShippingAddress.shipping_address_streetOne,
          originalShippingAddress.shipping_address_streetTwo,
          originalShippingAddress.shipping_address_city,
          originalShippingAddress.shipping_address_province,
          originalShippingAddress.shipping_address_zipCode,
          originalShippingAddress.customer_account_id_fk,
        ]);

      const newShippingAddressId = newShippingAddressResult.insertId;

      const createNewShippingQuery = `
        INSERT INTO shipping (
          shipping_date,
          shipping_method,
          shipping_trackingNumber,
          so_id_fk,
          shipping_address_id_fk
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      const [newShippingResult] = await dbConnection
        .promise()
        .query(createNewShippingQuery, [
          originalShipping.shipping_date,
          originalShipping.shipping_method,
          originalShipping.shipping_trackingNumber,
          newSalesOrderId,
          newShippingAddressId,
        ]);

      const newShippingId = newShippingResult.insertId;

      await dbConnection
        .promise()
        .query("UPDATE sales_order SET shipping_id_fk = ? WHERE so_id = ?", [
          newShippingId,
          newSalesOrderId,
        ]);

      await dbConnection
        .promise()
        .query(
          "UPDATE shipping SET shipping_address_id_fk = ? WHERE shipping_id = ?",
          [newShippingAddressId, newShippingId]
        );

      return {
        message: "Request has been updated successfully.",
        newSalesOrderId,
      };
    }
  }

  if (requestStatus === "Declined" && !isRequestLocked) {
    const requestLogQuery =
      "INSERT INTO request_logs (request_id_fk, admin_id_fk, request_log_message) VALUES (?, ?, ?);";
    const [requestLogResult] = await dbConnection
      .promise()
      .query(requestLogQuery, [requestId, adminId, "Request Declined"]);

    const requestLogId = requestLogResult.insertId;
    await dbConnection
      .promise()
      .query("UPDATE refund_return SET request_log_id_fk = ? WHERE rr_id = ?", [
        requestLogId,
        requestId,
      ]);
    await dbConnection
      .promise()
      .query(
        "UPDATE sales_order SET so_orderStatus = 'Delivered' WHERE so_id = ?",
        [salesOrderId]
      );
  }

  await dbConnection.promise().query(updateQuery, updateValues);
  return { message: "Request has been updated successfully." };
};

exports.getAllRequestLogs = async () => {
  const sql = "SELECT * FROM request_logs";
  const [data] = await dbConnection.promise().query(sql);
  return data;
};
