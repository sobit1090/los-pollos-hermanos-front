import React from 'react'
import {Link} from 'react-router-dom';
import { Helmet } from 'react-helmet';
function PaymentSuccess() {
   return (
    <section className="paymentsuccess">
      <Helmet>
              <title>Payment Success | Los Pollos Hermanos</title>
            </Helmet>
      <main>
        <h1>Order Confirmed</h1>
        <p>Order Placed Successfully, You can check order status below</p>
        <Link to="/myorders">Check Status</Link>
      </main>
    </section>
  );
}

export default PaymentSuccess;
