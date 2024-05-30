import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import ProductAdd from "./pages/ProductAdd";
import ProductUpdate from "./pages/ProductUpdate";
import Review from "./pages/Review";
import Supplier from "./pages/Supplier";
import SupplierAdd from "./pages/SupplierAdd";
import SupplierUpdate from "./pages/SupplierUpdate";
import PurchaseOrder from "./pages/PurchaseOrder";
import PurchaseOrderAdd from "./pages/PurchaseOrderAdd";
import PurchaseOrderUpdate from "./pages/PurchaseOrderUpdate";
import Reward from "./pages/Reward";
import RewardAdd from "./pages/RewardAdd";
import RewardUpdate from "./pages/RewardUpdate";
import Customer from "./pages/Customer";
import CustomerAdd from "./pages/CustomerAdd";
import CustomerUpdate from "./pages/CustomerUpdate";
import Order from "./pages/Order";
import Request from "./pages/Request";
import RequestUpdate from "./pages/RequestUpdate";
import Payment from "./pages/Payment";
import DeliveryLog from "./pages/DeliveryLog";
import OrderAdd from "./pages/OrderAdd";
import OrderUpdate from "./pages/OrderUpdate";
import Discount from "./pages/Discount";
import DiscountAdd from "./pages/DiscountAdd";
import DiscountUpdate from "./pages/DiscountUpdate";
import Category from "./pages/Category";
import Admin from "./pages/Admin";
import AdminAdd from "./pages/AdminAdd";
import AdminUpdate from "./pages/AdminUpdate";

import Layout from "./components/Layout";
import DeliveryLogUpdate from "./pages/DeliveryLogUpdate";
import PaymentVerificationLogUpdate from "./pages/PaymentUpdate";
import RequestLog from "./pages/RequestLogs";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/products" element={<Product />} />
          <Route path="/products/add" element={<ProductAdd />} />
          <Route path="/products/update/:id" element={<ProductUpdate />} />

          <Route path="/reviews" element={<Review />} />

          <Route path="/discounts" element={<Discount />} />
          <Route path="/discounts/add" element={<DiscountAdd />} />
          <Route path="/discounts/update/:id" element={<DiscountUpdate />} />

          <Route path="/customers" element={<Customer />} />
          <Route path="/customers/add" element={<CustomerAdd />} />
          <Route path="/customers/update/:id" element={<CustomerUpdate />} />

          <Route path="/suppliers" element={<Supplier />} />
          <Route path="/suppliers/add" element={<SupplierAdd />} />
          <Route path="/suppliers/update/:id" element={<SupplierUpdate />} />

          <Route path="/categories" element={<Category />} />

          <Route path="/purchaseorders" element={<PurchaseOrder />} />
          <Route path="/purchaseorders/add" element={<PurchaseOrderAdd />} />
          <Route
            path="/purchaseorders/update/:id"
            element={<PurchaseOrderUpdate />}
          />

          <Route path="/orders" element={<Order />} />
          <Route path="/orders/add" element={<OrderAdd />} />
          <Route path="/orders/update/:id" element={<OrderUpdate />} />

          <Route path="/requests" element={<Request />} />
          <Route path="/requests/update/:id" element={<RequestUpdate />} />

          <Route path="/requestlogs" element={<RequestLog />} />

          <Route path="/payments" element={<Payment />} />
          <Route
            path="/payments/update/:id"
            element={<PaymentVerificationLogUpdate />}
          />

          <Route path="/deliverylogs" element={<DeliveryLog />} />
          <Route
            path="/deliverylogs/update/:id"
            element={<DeliveryLogUpdate />}
          />

          <Route path="/rewards" element={<Reward />} />
          <Route path="/rewards/add" element={<RewardAdd />} />
          <Route path="/rewards/update/:id" element={<RewardUpdate />} />

          <Route path="/admins" element={<Admin />} />
          <Route path="/admins/add" element={<AdminAdd />} />
          <Route path="/admins/update/:id" element={<AdminUpdate />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
