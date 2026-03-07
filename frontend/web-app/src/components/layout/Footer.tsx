import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🎮</div>
              <span className="text-xl font-bold text-indigo-400">
                AccArenas
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Nền tảng mua bán tài khoản game uy tín và an toàn hàng đầu Việt
              Nam. Giao dịch nhanh chóng, minh bạch với đội ngũ hỗ trợ 24/7.
            </p>
            <div className="flex space-x-4">
              
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
             
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/game-accounts"
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  Tài khoản game
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  Danh mục
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  Trung tâm hỗ trợ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} AccArenas. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
            >
              Điều khoản
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
            >
              Quyền riêng tư
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
