import express from 'express';
import ViteExpress from 'vite-express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
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

// Khởi động server với ViteExpress
ViteExpress.listen(app, PORT, () => {
  console.log(`🚀 Server + Vite đang chạy tại http://localhost:${PORT}`);
});
