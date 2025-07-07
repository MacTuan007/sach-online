const express = require('express');
const ViteExpress = require('vite-express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const qs = require('qs');
const crypto = require('crypto');
const moment = require("moment")


const app = express();
const PORT = 5000;

app.use(cors({ origin: 'https://maximum-guinea-eternal.ngrok-free.app' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));
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
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

const pendingOrders = new Map();
app.post('/create_payment', async (req, res) => {
  const tmnCode = "CFFD0BGK"; // Lấy từ VNPay .env
  const secretKey = "E5LTCMVQ0NADKODCFFVVX1MIG8UL5MMR"; // Lấy từ VNPay

  const returnUrl = "http://localhost:5000/payment-result"; // Trang kết quả
  const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  let ipAddr = req.ip;
  let orderId = moment().format("YYYYMMDDHHmmss");
  let bankCode = "NCB";

  let createDate = moment().format("YYYYMMDDHHmmss");
  let orderInfo = "Thanh_toan_don_hang";
  let locale = "vn";
  let currCode = "VND";

  const { amount, emailKey, sachList } = req.body;
  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };
  // vnp_Params["vnp_BankCode"] = bankCode;

  vnp_Params = sortObject(vnp_Params);

  let signData = qs.stringify(vnp_Params);
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  let paymentUrl = vnp_Url + "?" + qs.stringify(vnp_Params);
  console.log("✅ paymentUrl:", paymentUrl);
  res.json({ paymentUrl });

});

app.get('/check_payment', (req, res) => {
  const query = req.query;
    const secretKey = "PBNLKF8YGRNCPXLDJLY9V1023CW8206U";
    const vnp_SecureHash = query.vnp_SecureHash;

    delete query.vnp_SecureHash;
    const signData = qs.stringify(query);

    const hmac = crypto.createHmac("sha512", secretKey);
    const checkSum = hmac.update(signData).digest("hex");
    console.log(query);

    if (vnp_SecureHash === checkSum) {
        if (query.vnp_ResponseCode === "00") {
            res.json({ message: "Thanh toán thành công", data: query });
        } else {
            res.json({ message: "Thanh toán thất bại", data: query });
        }
    } else {
        res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
});


// Khởi động server với ViteExpress
ViteExpress.listen(app, PORT, () => {
  console.log(`🚀 Server + Vite đang chạy tại http://localhost:${PORT}`);
});
