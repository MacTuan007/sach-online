import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));


app.post('/api/send-email', async (req, res) => {
  const { email, order } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '2024801060069@student.tdmu.edu.vn',
      pass: 'btzy znua zcvv nsrz', 
    },
  });

  const mailOptions = {
    from: '2024801060069@student.tdmu.edu.vn',
    to: email,
    subject: 'Xác nhận đơn hàng',
    text: order.map(item => `${item.ten} - SL: ${item.soluong}`).join('\n'),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email đã được gửi thành công' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    res.status(500).send({ message: 'Gửi email thất bại' });
  }
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
