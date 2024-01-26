const API = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RVMU1qWTFMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuZVZwd2RnS19Xb0xfR2VlSWJZdXdmT1RiVnpqTjExMTE0eE9xTTk4VnU3SVpqNlYwd1hYX2pxZVh0cGQxaVJQLWNmOG9oRmUxbzZyRTN0eU9ZMkJweHc='; // Replace with your API key
const integrationID = 4447082;

async function getToken() {
  const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ api_key: API })
  });

  const { token } = await response.json();
  return token;
}

async function createOrder(token) {
  const data = {
    auth_token: token,
    delivery_needed: false,
    amount_cents: '100',
    currency: 'EGP',
    items: []
  };

  const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const { id } = await response.json();
  return id;
}

async function generatePaymentKey(token, orderId) {
  const data = {
    auth_token: token,
    amount_cents: '100',
    expiration: 3600,
    order_id: orderId,
    billing_data: {
      apartment: '803',
      email: 'claudette09@exa.com',
      floor: '42',
      first_name: 'Clifford',
      street: 'Ethan Land',
      building: '8028',
      phone_number: '+86(8)9135210487',
      shipping_method: 'PKG',
      postal_code: '01898',
      city: 'Jaskolskiburgh',
      country: 'CR',
      last_name: 'Nicolas',
      state: 'Utah'
    },
    currency: 'EGP',
    integration_id: integrationID
  };

  const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const { token: paymentToken } = await response.json();
  return paymentToken;
}

function redirectToPayment(paymentToken) {
  const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/819226?payment_token=${paymentToken}`;
  location.href = iframeURL;
}

async function initiatePayment() {
  try {
    const token = await getToken();
    const orderId = await createOrder(token);
    const paymentToken = await generatePaymentKey(token, orderId);
    redirectToPayment(paymentToken);
  } catch (error) {
    console.error('Payment initiation failed:', error);
  }
}

initiatePayment();