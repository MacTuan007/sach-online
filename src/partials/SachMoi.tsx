import sach1 from '/images/abc.jpg';
export default function SachMoi() {
  return (
    <>
      <h2 className="text-center">SÁCH MỚI</h2>
      <hr/>
        <div className="row text-center">
          <div className="col-sm-4 col-md-4 col-lg-4 col-xs-6">
            <div className="thumbnail">
              <img src={sach1} alt="Thumbnail Image 1" className="img-responsive img-rounded imgbook "></img>
                <div className="caption">
                  <h3>Sản phẩm</h3>
                  <p>Mô tả tóm tắt sản phẩm</p>
                  <p><a href="#" className="btn btn-warning" role="button"><span className="glyphicon glyphicon-shopping-cart"
                    aria-hidden="true"></span> Add to Cart</a></p>
                </div>
            </div>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4 col-xs-6">
            <div className="thumbnail">
              <img src={sach1} alt="Thumbnail Image 1" className="img-responsive img-rounded imgbook "></img>
                <div className="caption">
                  <h3>Sản phẩm </h3>
                  <p>Mô tả tóm tắt sản phẩm</p>
                  <p>
                    <a href="#" className="btn btn-danger" role="button">
                      <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Add to Cart
                    </a>
                  </p>
                </div>
            </div>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4 col-xs-6 hidden-xs">
            <div className="thumbnail">
              <img src={sach1} alt="Thumbnail Image 1" className="img-responsive img-rounded imgbook "></img>
                <div className="caption">
                  <h3>Sản phẩm </h3>
                  <p>Mô tả tóm tắt sản phẩm</p>
                  <p><a href="#" className="btn btn-primary" role="button"><span className="glyphicon glyphicon-shopping-cart"
                    aria-hidden="true"></span> Add to Cart</a> </p>
                </div>
            </div>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4 col-xs-6">
            <div className="thumbnail">
              <img src={sach1} alt="Thumbnail Image 1" className="img-responsive img-rounded imgbook "></img>
                <div className="caption">
                  <h3>Sản phẩm </h3>
                  <p>Mô tả tóm tắt sản phẩm</p>
                  <p><a href="#" className="btn btn-primary" role="button"><span className="glyphicon glyphicon-shopping-cart"
                    aria-hidden="true"></span> Add to Cart</a> </p>
                </div>
            </div>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4 col-xs-6">
            <div className="thumbnail">
              <img src={sach1} alt="Thumbnail Image 1" className="img-responsive img-rounded imgbook "></img>
                <div className="caption">
                  <h3>Sản phẩm </h3>
                  <p>Mô tả tóm tắt sản phẩm</p>
                  <p>
                    <a href="#" className="btn btn-primary" role="button">
                      <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Add to Cart
                    </a>
                  </p>
                </div>
            </div>
          </div>
          <div className="col-sm-4 col-md-4 col-lg-4 col-xs-6 hidden-xs">
            <div className="thumbnail">
              <img src={sach1} alt="Thumbnail Image 1" className="img-responsive img-rounded imgbook "></img>
                <div className="caption">
                  <h3>Sản phẩm </h3>
                  <p>Mô tả tóm tắt sản phẩm</p>
                  <p>
                    <a href="#" className="btn btn-primary" role="button">
                      <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Add to Cart
                    </a>
                  </p>
                </div>
            </div>
          </div>
        </div>
    </>
    )
}

