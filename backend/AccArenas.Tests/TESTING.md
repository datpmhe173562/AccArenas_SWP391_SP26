# Hướng dẫn chạy test (MSTest)

## Lệnh nhanh

- Đứng trong thư mục **backend/AccArenas.Tests**:
  - Chạy toàn bộ: dotnet test AccArenas.Tests.csproj
  - Chạy theo class: dotnet test AccArenas.Tests.csproj --filter "FullyQualifiedName~AccArenas.Tests.Controllers.AuthControllerTests"
  - Chạy một method: dotnet test AccArenas.Tests.csproj --filter "FullyQualifiedName~AuthControllerTests.Login_UTCID01_ValidCredentials_ShouldReturnOk"
  - Chạy theo category: dotnet test AccArenas.Tests.csproj --filter "TestCategory=Auth"

## Chạy lặp khi code đổi

- Tự động chạy lại khi chỉnh sửa (đứng ở repo gốc):  
  dotnet watch test backend/AccArenas.Tests/AccArenas.Tests.csproj --filter "AuthControllerTests"
- Đứng trong thư mục backend/AccArenas.Tests:  
  dotnet watch test AccArenas.Tests.csproj --filter "AuthControllerTests"

## Xuất báo cáo

- Lưu file kết quả `.trx`:  
  dotnet test backend/AccArenas.Tests/AccArenas.Tests.csproj --logger "trx;LogFileName=test.trx"

## VS Code Test Explorer

- Mở file test, nhấn "Run Test" trên từng `[TestMethod]` hoặc cả class.
- Bật Test Explorer (C# extension), chọn test muốn chạy.

## Lưu ý

- Luôn chạy từ thư mục gốc repo hoặc dùng đường dẫn tương đối như trên.
- `dotnet test` chỉ nhận `.csproj`/`.sln`, không nhận trực tiếp file `.cs`.
