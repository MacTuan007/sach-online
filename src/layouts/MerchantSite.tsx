import { useState } from "react";

export default function MerchantSite() {
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    const handleBankClick = (bankId: string) => {
        setSelectedBank(bankId);
    };
    const banks = [
        { id: 'vietinbank', name: 'Vietinbank', img: 'images/bank-vtb.svg' },
        { id: 'agribank', name: 'Agribank', img: 'images/bank-varb.svg' },
        { id: 'vietcombank', name: 'Vietcombank', img: 'images/bank-vcb.svg' },
        { id: 'bidv', name: 'BIDV', img: 'images/bank-bidv.svg' },
        { id: 'dongabank', name: 'Đông Á Bank', img: 'images/bank-dab.svg' },
        { id: 'sacombank', name: 'Sacombank', img: 'images/bank-scb.svg' },
        { id: 'acb', name: 'ACB', img: 'images/bank-acb.svg' },
        { id: 'mbbank', name: 'MBBank', img: 'images/bank-mb.svg' },
        { id: 'techcombank', name: 'Techcombank', img: 'images/bank-tcb.svg' },
        { id: 'vpbank', name: 'VPBank', img: 'images/bank-vpb.svg' },
        { id: 'eximbank', name: 'Eximbank', img: 'images/bank-eib.svg' },
        { id: 'vib', name: 'VIB', img: 'images/bank-vib.svg' },
        { id: 'hdbank', name: 'HDBank', img: 'images/bank-hdb.svg' },
        { id: 'oceanbank', name: 'Oceanbank', img: 'images/bank-ojb.svg' },
        { id: 'shb', name: 'SHB', img: 'images/bank-shb.svg' },
        { id: 'msb', name: 'Maritime Bank', img: 'images/bank-msb.svg' },
        { id: 'seabank', name: 'SeABank', img: 'images/bank-seab.svg' },
        { id: 'abbank', name: 'ABBank', img: 'images/bank-abb.svg' },
        { id: 'tpbank', name: 'TPBank', img: 'images/bank-tpb.svg' },
        { id: 'sgcb', name: 'TMCP Sài Gòn', img: 'images/bank-sgcb.svg' },
        { id: 'lienvietpostbank', name: 'Liên Việt Post Bank', img: 'images/bank-lpb.svg' },
        { id: 'saigonbank', name: 'SaigonBank', img: 'images/bank-sgb.svg' },
        { id: 'ocb', name: 'OCB', img: 'images/bank-ocb.svg' },
        { id: 'nama', name: 'Nam Á Bank', img: 'images/bank-nab.svg' },
        { id: 'vietabank', name: 'Việt Á Bank', img: 'images/bank-vab.svg' },
        { id: 'baovietbank', name: 'Bảo Việt Bank', img: 'images/bank-bvb.svg' },
        { id: 'gpbank', name: 'GPBank', img: 'images/bank-gpb.svg' },
        { id: 'baca', name: 'Bắc Á Bank', img: 'images/bank-bab.svg' },
        { id: 'vietcapital', name: 'Ngân hàng Bản Việt', img: 'images/bank-vccb.svg' },
    ];

    const handleConfirm = async () => {
        try {
            const response = await fetch('https://maximum-guinea-eternal.ngrok-free.app/api/vnpay/thanh_toan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: 100000, 
                    bankCode: selectedBank || '',
                }),
            });

            const data = await response.json();
            if (data.code === '00') {
                window.location.href = data.paymentUrl;
            } else {
                alert('Tạo thanh toán thất bại: ' + data.message);
            }
        } catch (error) {
            console.error('Lỗi khi tạo thanh toán:', error);
            alert('Có lỗi xảy ra khi thanh toán');
        }
    };

    return (
        <>
            <p>Vui lòng chọn hình thức thanh toán:</p>
            <div className="mb-1">
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="vi"
                        checked={selectedPayment === 'vi'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    Ví <img src="images/logo-zalopay.svg" alt="" />
                </label>
            </div>
            <div className="mb-1">
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="visa"
                        checked={selectedPayment === 'visa'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    Visa, Mastercard, JCB
                    <span className="txtGray">(qua cổng ZaloPay)</span>
                </label>
            </div>
            <div className="mb-1">
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="atm"
                        checked={selectedPayment === 'atm'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    Thẻ ATM
                    <span className="txtGray">(qua cổng ZaloPay)</span>
                </label>
            </div>
            {selectedPayment === 'atm' && (
                <div className="bank-group">
                    {banks.map((bank) => (
                        <a
                            key={bank.id}
                            href="#"
                            className={`bank-item ${selectedBank === bank.id ? 'selected' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleBankClick(bank.id);
                            }}
                        >
                            <img src={bank.img} alt="" /> {bank.name}
                            <img src="images/check-mark.svg" alt="" className="checkmark" />
                        </a>
                    ))}
                </div>
            )}
            <button className="pay-button" onClick={handleConfirm}>Xác nhận</button>
        </>
    );
}