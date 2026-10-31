import api from './api';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Razorpay checkout'));
    document.body.appendChild(script);
  });
}

// Resolves with 'PAID', 'FAILED' or 'DISMISSED'
export const payForOrder = async (orderId, user) => {
  await loadRazorpayScript();
  const { data } = await api.post(`/payments/create/${orderId}`);

  return new Promise((resolve, reject) => {
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,
      name: 'Sales Savvy',
      description: `Order #${orderId}`,
      prefill: { email: user?.email },
      theme: { color: '#e4572e' },
      handler: async (response) => {
        try {
          const result = await api.post('/payments/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          resolve(result.data.status === 'SUCCESS' ? 'PAID' : 'FAILED');
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => resolve('DISMISSED'),
      },
    };
    new window.Razorpay(options).open();
  });
};
