# Playwright capture

Chụp một URL đã render (sau JavaScript) gồm: DOM, ảnh full-page, layout + computed style từng phần tử, danh sách request và file asset (CSS/JS/ảnh/font).

## Chạy

```bash
cd tools/capture
node capture.js https://example.com
node capture.js https://example.com --viewports desktop,tablet,mobile --out ./captures/example
```

Tuỳ chọn:

| Cờ | Mặc định | Ý nghĩa |
|---|---|---|
| `--out` | `./captures/<host>` | Thư mục đầu ra |
| `--viewports` | `desktop` | `desktop` (1440×900), `tablet` (768×1024), `mobile` (390×844) |
| `--scale` | `2` | deviceScaleFactor (dùng 1 nếu chỉ để so sánh nhanh) |
| `--wait` | `1500` | ms chờ thêm sau khi mạng rảnh |
| `--no-assets` | | Không lưu file asset |
| `--no-layout` | | Không dump layout.json |

Đầu ra mỗi viewport:

```
<out>/<viewport>/page.html
<out>/<viewport>/screenshot.png
<out>/<viewport>/layout.json
<out>/<viewport>/requests.json
<out>/<viewport>/assets/index.json  (+ các file asset)
```

## Lưu ý

- Dùng Chromium và Playwright có sẵn trong môi trường; không chạy `playwright install`.
- Chỉ dùng cho trang bạn sở hữu hoặc có quyền. Nội dung và thiết kế của người khác có thể có bản quyền.
- Thư mục `captures/` là kết quả tạm, không commit.
