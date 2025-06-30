const express = require('express');
const ViteExpress = require('vite-express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const qs = require('qs');
const crypto = require('crypto');
const { ignoreLogger, VNPay, ProductCode, VnpLocale, dateFormat } = require('vnpay');


const app = express();
const PORT = 5000;
const vnpay = new VNPay({
  TmnCode: 'T0XYPCO6',
  secureSecret: 'KWQLKX4J89SCOXZ6KBSJMWGQ5PBBD3RL',
  vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  testMode: true,
  hashAlgorithm: 'SHA512',
  loggerFn: ignoreLogger,
})

app.use(cors({ origin: 'https://maximum-guinea-eternal.ngrok-free.app' }));
app.use(bodyParser.json());

// Route gửi email
app.post('/api/send-email', async (req, res) => {
  const { email, order } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '2024801030069@student.tdmu.edu.vn',
      pass: 'veyddaamgasldkus',
    },
  });

  const total = order.reduce((sum, item) => sum + item.thanhtien, 0);

  const mailOptions = {
    from: '2024801030069@student.tdmu.edu.vn',
    to: email,
    subject: 'Xác nhận đơn hàng',
    text:
      `Chi tiết đơn hàng của bạn:\n\n` +
      order.map(item =>
        `${item.ten} - SL: ${item.soluong} - Giá: ${item.giatien.toLocaleString()}₫ - Thành tiền: ${item.thanhtien.toLocaleString()}₫`
      ).join('\n') +
      `\n\nTổng cộng: ${total.toLocaleString()}₫` +
      `\n\nXin cảm ơn vì đã đặt hàng!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email đã được gửi thành công' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    res.status(500).send({ message: 'Gửi email thất bại' });
  }
});

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = typeof obj[key] === 'string' ? obj[key] : obj[key].toString();
    });
  return sorted;
}

const pendingOrders = new Map();
app.post('/api/vnpay/thanh-toan', async (req, res) => {
  const ipRaw = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ipAddr = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw.toString().split(',')[0].trim();

  const date = new Date();

  const createDate = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date
      .getHours()
      .toString()
      .padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
  const orderId = date.getTime();


  const { emailKey, sachList } = req.body;
  pendingOrders.set(orderId.toString(), { emailKey, sachList });
  const ahour = new Date();
  ahour.setHours(ahour.getHours() + 1);
  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: 'T0XYPCO6',
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId.toString(),
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_OrderType: 'other', // hoặc "order" nếu muốn thanh toán đơn hàng
    vnp_Amount: (10000 * 100).toString(), // phải nhân 100
    vnp_ReturnUrl: 'https://maximum-guinea-eternal.ngrok-free.app/vnpay_return',
    vnp_IpAddr: ipAddr.toString(),
    vnp_CreateDate: dateFormat(new Date()).toString(),
    vnp_ExpireDate: dateFormat(ahour).toString(),
  };
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  console.log("✅ signData:", signData);
  const hmac = crypto.createHmac('sha512', 'KWQLKX4J89SCOXZ6KBSJMWGQ5PBBD3RL');
  const signed = hmac.update(signData, 'utf-8').digest('hex');
  console.log("✅ signed:", signed);
  sortedParams.vnp_SecureHash = signed;

  const paymentUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?' +
    qs.stringify(sortedParams, { encode: true });
  console.log("✅ paymentUrl:", paymentUrl);



  // const vnpayResponse = await vnpay.buildPaymentUrl({
  //   vnp_ReturnUrl: 'https://maximum-guinea-eternal.ngrok-free.app/vnpay_return',
  //   vnp_Locale: VnpLocale.VN,
  //   vnp_CurrCode: 'VND',
  //   vnp_TxnRef: orderId.toString(),
  //   vnp_OrderInfo: orderInfo,
  //   vnp_OrderType: 'order',
  //   vnp_Amount: amount,
  //   vnp_IpAddr: ipAddr,
  //   vnp_CreateDate: dateFormat(new Date()),
  //   vnp_ExpireDate: dateFormat(ahour),
  // })
  // console.log("Payment URL:", vnpayResponse);

  res.json({ paymentUrl });
});

app.get('/vnpay_return', (req, res) => {
  const vnp_Params = req.query;
  console.log("🔁 VNPay callback query:", req.query);

  // Tách secure hash ra
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  // Sort params
  const sortedParams = sortObject(vnp_Params);

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
  const signed = hmac.update(signData, 'utf-8').digest('hex');

  // So sánh chữ ký
  if (secureHash === signed) {
    // ✅ Thành công
    return res.send('Thanh toán thành công');
  } else {
    // ❌ Sai chữ ký
    return res.status(400).send('Sai chữ ký');
  }
});

// app.get('/vnpay_return', async (req, res) => {
//   // let vnp_Params = req.query;
//   // const secureHash = vnp_Params['vnp_SecureHash'];
//   // delete vnp_Params['vnp_SecureHash'];
//   // delete vnp_Params['vnp_SecureHashType'];
//   // const hashSecret = 'KWQLKX4J89SCOXZ6KBSJMWGQ5PBBD3RL'; // đặt biến tường minh
//   // const signData = querystring.stringify(sortObject(vnp_Params), { encode: false });
//   // const hmac = crypto.createHmac('sha512', hashSecret);
//   // const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

//   // if (secureHash === signed) {
//   //   const txnRef = vnp_Params['vnp_TxnRef'];
//   //   const orderData = pendingOrders.get(txnRef);

//   //   if (!orderData) {
//   //     return res.status(404).send('Không tìm thấy đơn hàng tương ứng');
//   //   }

//   //   const { emailKey, sachList } = orderData;

//   //   const updates = {};
//   //   const timestamp = Date.now().toString();
//   //   for (const sach of sachList) {
//   //     updates[`LichSuGiaoDich/${emailKey}/${timestamp}/${sach.id}`] = sach.soluong;
//   //   }

//   //   await update(ref(db), updates);
//   //   await remove(ref(db, `GioHang/${emailKey}`));
//   //   pendingOrders.delete(txnRef);

//   //   res.send('Thanh toán thành công! ✅ Đơn hàng đã được ghi nhận.');
//   // } else {
//   //   res.status(400).send('Chữ ký không hợp lệ! ❌');
//   // }
// });



// Khởi động server với ViteExpress
ViteExpress.listen(app, PORT, () => {
  console.log(`🚀 Server + Vite đang chạy tại http://localhost:${PORT}`);
});
