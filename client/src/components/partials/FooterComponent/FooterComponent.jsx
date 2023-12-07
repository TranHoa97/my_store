import React from 'react'

import bct from '../../../assets/logo-bct/bct.png'

const FooterComponent = () => {
  return (
    <footer className='footer'>
      <div className="wrapper">
        <div className='footer__content'>
          {/* Công ty tnhh */}
            <div className='footer__content__item cong-ty-tnhh'>
              <ul>
                <h6><b>công ty tnhh tin học công nghệ az việt nam</b></h6>
                <li>Địa chỉ: Số 18, ngõ 121, Thái Hà, Đống Đa, Hà Nội</li>
                <li>Hotline: 0825 233 233</li>
                <li>Email: hotrolaptopaz@gmail.com</li>
                <li className='share'>
                  <a href='#'><i className="fa-brands fa-facebook-f"></i></a>
                  <a href='#'><i className="fa-brands fa-youtube"></i></a>
                  <a href='#'><i className="fa-brands fa-tiktok"></i></a>
                </li>
              </ul>
            </div>

          {/* Thông tin công ty */}
            <div className='footer__content__item thong-tin'>
              <ul>
                <h6><b>thông tin công ty</b></h6>
                <li><a href="#">Giới thiệu công ty</a></li>
                <li><a href="#">Tuyển dụng</a></li>
                <li><a href="#">Gửi góp ý, khiếu nại</a></li>
                <li>
                  <a href='#' style={{ float: "left" }}><img src={bct}/></a>
                </li>
              </ul>
            </div>

          {/* Chính sách công ty */}
            <div className='footer__content__item chinh-sach'>
              <ul>
                <h6><b>Chính sách công ty</b></h6>
                <li><a href="#">Chính sách chất lượng</a></li>
                <li><a href="#">Chính sách bảo hành</a></li>
                <li><a href="#">Chính sách đổi trả</a></li>
                <li><a href="#">Chính sách bảo mật thông tin</a></li>
                <li><a href="#">Chính sách vận chuyển</a></li>
                <li><a href="#">Hướng dẫn mua hàng - thanh toán</a></li>
              </ul>
            </div>

          {/* Hotline */}
            <div className='footer__content__item hot-line'>
              <ul>
                <li className='hotline'>
                  <i className="fa-solid fa-phone-volume"></i>
                  <span><p>hotline</p> 0825 233 233</span>
                </li>
              </ul>
            </div>

          {/* Cửa hàng Thái Hà */}
            <div className='footer__content__item cua-hang-1'>
              <ul>
                <h6><b>hệ thống cửa hàng laptopaz</b></h6>
                <li><b>LaptopAZ cơ sở Thái Hà</b></li>
                <li>Số 18, ngõ 121, Thái Hà, Đống Đa, Hà Nội</li>
                <li><a href="#">Hotline: 0825 233 233</a></li>
                <li>Bán hàng: Từ 8h30 - 21h30</li>
                <li>Kỹ thuật: Từ 8h30 - 12h & 13h30 - 17h30</li>
                <li><a href='#'>Xem chỉ đường</a></li>
              </ul>
            </div>

          {/* Cửa hàng Hà Đông */}
            <div className='footer__content__item cua-hang-2'>
              <ul>
                <h6><b>hệ thống cửa hàng laptopaz</b></h6>
                <li><b>LaptopAZ cơ sở Hà Đông</b></li>
                <li>Số 56 Trần Phú, Hà Đông, Hà Nội</li>
                <li><a href="#">Hotline: 0825 233 233</a></li>
                <li>Bán hàng: Từ 8h30 - 21h30</li>
                <li>Kỹ thuật: Từ 8h30 - 12h & 13h30 - 17h30</li>
                <li><a href='#'>Xem chỉ đường</a></li>
              </ul>
            </div>

            <div className='footer__content__line'></div>

            <div className='footer__content__title'>
              <span>Công ty TNHH Tin học Công nghệ AZ Việt Nam. MST số 0108956087 cấp ngày 23/10/2019</span>
              @ Laptopaz. All Rights Reserved
            </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent