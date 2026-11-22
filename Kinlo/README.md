# Kinlo — spec để clone

Nguồn tham chiếu: https://demo.codeandchill.store/kinlo/ (bản demo, chụp ngày 2026-11-22)
Mục đích: dựng lại giao diện dashboard bằng SvelteKit 5 (runes, component tái sử dụng, layout lồng nhau).

## Quy tắc

- Repo chỉ lưu spec này. Không commit HTML, CSS, JS, ảnh, font hoặc văn bản gốc của trang.
- Toàn bộ nội dung, số liệu và tên hiển thị phải tự viết hoặc dùng dữ liệu giả.
- Font Urbanist (Google Fonts, giấy phép OFL) được phép dùng.
- Trước khi dùng cho dự án thương mại, cần xác nhận giấy phép của template.

## Cách chụp lại (dữ liệu để lưu ngoài repo)

```bash
web-capture https://demo.codeandchill.store/kinlo/ --out ~/captures/kinlo --viewports desktop,mobile --scale 1
```

Kết quả gồm `layout.json`, `motion.json`, `requests.json`, `screenshot.png`. Các file này dùng để đối chiếu, không commit.

## Viewport đã đo

| Viewport | Rộng | Cao trang | Ghi chú |
|---|---|---|---|
| desktop | 1440 | ~1727 | Sidebar trái rộng 224, top bar cao 64, lưới thẻ 3 cột |
| mobile | 390 | ~4346 | Một cột, lề 14, sidebar không hiển thị cố định |

Cần đo thêm các breakpoint trung gian (tablet, khoảng 1024 và 768) trước khi viết responsive.

## Cấu trúc layout

- **Sidebar (`nav`)**: cột trái, nhóm mục điều hướng. Có trạng thái thu gọn (`is-rail`).
- **Top bar (`header.top`)**: cao 64, có breadcrumb. Có trạng thái dính khi cuộn (`is-stuck`) với một dải phụ phía dưới.
- **Page header (`header.phead`)**: tiêu đề trang (h1) và khu vực mô tả hoặc hành động.
- **Khu nội dung**: lưới thẻ (`section.card`), mỗi thẻ có h2 riêng. Thẻ có thể chiếm rộng hơn (`card--flush` không có padding).

## Danh sách component cần dựng

| Component | Vai trò | Ghi chú |
|---|---|---|
| AppShell (layout) | Sidebar + topbar + vùng nội dung | Đặt ở `+layout.svelte` |
| Sidebar / NavItem | Điều hướng, có trạng thái active và thu gọn | Có `nav__pill`, `nav__chev` |
| TopBar / Breadcrumb | Thanh trên cùng | Có trạng thái dính |
| PageHeader | Tiêu đề trang | Dùng cho mọi page |
| Card | Khung thẻ, props: tiêu đề, flush | Thẻ tái sử dụng |
| StatTile / Sparkline | Số liệu và đường nhỏ | `spark__area` |
| BarChart | Biểu đồ cột | `bars__bar`, `bars__col.is-hi` |
| AreaChart | Biểu đồ vùng | `area__cmp`, `area__x` |
| ChartTooltip | Tooltip biểu đồ | `charttip` |
| SegmentedControl | Chọn một trong nhiều | `seg__thumb` |
| Tabs | Tab có đường gạch dưới trượt | `tabs__line` |
| Checkbox | Checkbox dạng switch | `check svg`, `aria-checked` |
| StatusDot | Chấm trạng thái nhấp nháy | `tonight__dot`, `steps__dot` |

## Chuyển động

- **Keyframes**: `breathe` (chấm trạng thái, chạy lặp, đang chạy khi tải trang), `flash` (dùng cho `.is-flash`).
- **Transition**: nav pill, tabs line, seg thumb, bars, chevron, checkbox.
- **View Transition**: có rule `::view-transition-old/new(root)`, cần kiểm tra khi chuyển trang.
- **Cuộn**: không có thư viện animation (GSAP, Lenis, ...) được phát hiện. Hiệu ứng chủ yếu là CSS.

Cần bổ sung bằng `--sample` (hover, click) cho từng component trước khi viết animation.

## Responsive

- Desktop: sidebar cố định bên trái, lưới 3 cột.
- Mobile: thẻ xếp một cột, chiều cao tăng mạnh. Có khu vực điều hướng riêng cho mobile.

## Kế hoạch build

1. Dựng `AppShell` và route layout.
2. Dựng các component nguyên tử: Card, PageHeader, SegmentedControl, Tabs, Checkbox.
3. Dựng biểu đồ bằng SVG thuần, dữ liệu giả.
4. Ghép từng trang (route) theo cấu trúc trong mục layout.
5. Kiểm tra đối chiếu với bản chụp ở hai viewport.
