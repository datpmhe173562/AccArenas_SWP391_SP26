import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                Chào mừng đến với{" "}
                <span className="text-indigo-600">AccArenas</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
                Thị trường mua bán tài khoản game uy tín, an toàn và nhanh chóng
              </p>

              <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/game-accounts"
                  className="px-8 py-4 text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
                >
                  Khám phá ngay
                </Link>
                <Link
                  href="/auth/register"
                  className="px-8 py-4 text-base font-medium rounded-lg text-indigo-600 bg-white border-2 border-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Tại sao chọn AccArenas?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Nền tảng hàng đầu với nhiều tính năng vượt trội
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-8 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  An toàn & Bảo mật
                </h3>
                <p className="text-gray-600">
                  Giao dịch được mã hóa và bảo vệ bởi hệ thống bảo mật đa lớp
                </p>
              </div>

              <div className="relative p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Giao dịch nhanh
                </h3>
                <p className="text-gray-600">
                  Hệ thống tự động xử lý giao dịch trong vài phút
                </p>
              </div>

              <div className="relative p-8 bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Giá tốt nhất
                </h3>
                <p className="text-gray-600">
                  Cam kết giá cả cạnh tranh và nhiều ưu đãi hấp dẫn
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-indigo-200">Tài khoản đã bán</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5K+</div>
                <div className="text-indigo-200">Người dùng</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-indigo-200">Game hỗ trợ</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-indigo-200">Hài lòng</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tham gia cùng hàng nghìn game thủ đang giao dịch mỗi ngày
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-8 py-4 text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              Đăng ký miễn phí ngay
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
