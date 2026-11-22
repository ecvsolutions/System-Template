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
web-capture https://demo.codeandchill.store/kinlo/ --out ~/captures/kinlo --viewports desktop,laptop,tablet,mobile --scale 1
web-capture https://demo.codeandchill.store/kinlo/ --out ~/captures/kinlo-hover --viewports desktop --no-assets --no-layout --no-motion --sample ".btn--primary" --hover
```

Kết quả gồm `layout.json`, `motion.json`, `requests.json`, `screenshot.png` và `sample-*.json`. Các file này dùng để đối chiếu, không commit.

## Viewport đã đo

| Viewport | Rộng | Cao trang | Sidebar | Điều hướng chính |
|---|---|---|---|---|
| desktop | 1440 | ~1727 | `aside.side` cố định (sticky), rộng 248 | Sidebar đầy đủ nhãn |
| laptop | 1024 | ~2914 | sticky, rộng 84 (rail) | Chỉ icon, không có nhãn |
| tablet | 768 | ~3156 | sticky, rộng 84 (rail) | Giống laptop |
| mobile | 390 | ~4346 | `aside.side` fixed, rộng 300 (drawer, ẩn ngoài màn hình) | `nav.tabbar` fixed ở đáy, cao 66, rộng 370, có nút "more" |

Breakpoint sidebar đã đo: ở 1270 sidebar rộng 84 (rail), ở 1280 rộng 248 (đầy đủ). Ngưỡng nằm trong khoảng 1271–1280, có thể là 1280px.
Các mốc đã đo: 1024, 1200, 1240, 1260, 1270 đều là rail. 1280 và 1440 đều là sidebar đầy đủ.

## Cấu trúc layout

- **Sidebar (`aside.side`)**: cột trái, chứa `div.side__head`, `div.side__scroll` và `div.side__navs`. Các nhóm điều hướng là `div.navgroup` với `span.navgroup__label`. Mỗi mục là `a.nav__item` với `span.nav__label` và `span.nav__count`, có `span.nav__pill` làm nền trượt cho mục đang chọn. Trên mobile có nút `button.side__close`.
- **Top bar (`header.top`)**: cao 64, bên trong có breadcrumb (`nav.crumbs`) và các nút icon `button.ibtn` (lịch, theme, menu). Có trạng thái dính khi cuộn (`is-stuck`).
- **Page header (`header.phead`)**: h1 và khu vực mô tả hoặc hành động. Chiều cao khoảng 57 ở laptop, 78 ở tablet, 134 ở mobile.
- **Khu nội dung (`main`)**: lưới thẻ `section.card`, mỗi thẻ có h2 riêng. Thẻ `card--flush` không có padding.
- **Mobile tabbar (`nav.tabbar`)**: `span.tabbar__pill` làm nền trượt, `button.tabbar__more` mở drawer.

## Lưới thẻ theo viewport

- Desktop 1440: thẻ đầu rộng full, các thẻ phía dưới chia 2 hoặc 3 cột.
- Laptop 1024: thẻ chính rộng 892, cặp thẻ con chia đôi (437 mỗi thẻ).
- Tablet 768: thẻ rộng 648, cặp thẻ con chia đôi (315 mỗi thẻ).
- Mobile 390: một cột, lề 14, thẻ rộng 362.

## Danh sách component cần dựng

| Component | Vai trò | Ghi chú |
|---|---|---|
| AppShell (layout) | Sidebar + topbar + vùng nội dung + tabbar mobile | `+layout.svelte` |
| Sidebar | Điều hướng, có chế độ đầy đủ và rail | Breakpoint 1280 (rail khi dưới 1280) |
| NavItem | Mục điều hướng có nhãn, count và pill trượt | `nav__item`, `nav__pill` |
| MobileTabbar | Thanh dưới đáy trên mobile, có drawer | `tabbar`, `tabbar__pill` |
| TopBar / Breadcrumb | Thanh trên cùng, có trạng thái dính | `top`, `crumbs` |
| IconButton | Nút icon có biến thể nhỏ, có badge | `ibtn`, `ibtn--sm`, `ibtn__badge` |
| PageHeader | Tiêu đề trang | `phead` |
| Card | Khung thẻ, props: tiêu đề, flush | `section.card` |
| Button | Biến thể primary, dark, ghost, block, sm | `btn`, `btn--primary`, `btn--ghost` |
| StatTile / Sparkline | Số liệu và đường nhỏ | `spark__area` |
| BarChart | Biểu đồ cột | `bars__bar`, `bars__col.is-hi` |
| AreaChart | Biểu đồ vùng | `area__cmp`, `area__x` |
| ChartTooltip | Tooltip biểu đồ | `charttip` |
| SegmentedControl | Chọn một trong nhiều, dùng `aria-pressed` | `seg`, `seg__thumb` |
| Checkbox | Checkbox dạng switch (chưa thấy trên trang này) | `aria-checked` |
| StatusDot | Chấm trạng thái nhấp nháy | `tonight__dot`, `steps__dot` |

## Trạng thái hover (đã đo)

| Phần tử | Trạng thái | Thay đổi đo được | Thời lượng |
|---|---|---|---|
| `.btn--primary` | hover | Nền từ rgb(14,108,132) sang rgb(18,125,152), transform gần 0 | khoảng 0.8s (theo transition) |
| `.btn--ghost` | hover | Nền từ trong suốt sang rgba(23,37,45,0.043) | khoảng 0.8s |
| `.nav__pill` | hover | Không đổi ở các thuộc tính đã đo | — |
| `section.card` | hover | Không đổi ở các thuộc tính đã đo (nền, viền, box-shadow) | — |
| Segmented control (`.seg > button`) | click option 3 | Option đang chọn đánh dấu bằng `aria-pressed="true"`. `.seg__thumb` chỉ dịch khoảng 1px (743 → 744), nên hiệu ứng chủ yếu là đổi trạng thái, không phải trượt | khoảng 0.9s |

Các option của segmented control là "7 days", "12 weeks", "12 months".

Drawer mobile (`aside.side`, 390px):
- Khi đóng: `visibility: hidden`.
- Bấm `.tabbar__more`: `visibility` đổi thành `visible`, xuất hiện một lớp nền mờ (class chứa scrim, backdrop hoặc overlay). `transform` vẫn là `none` ở cuối transition, nên drawer không trượt bằng transform. Có thể hiện bằng visibility và opacity.
- Lớp class trên `aside` vẫn là `side` trước và sau khi mở. Trạng thái mở nằm ở class khác, cần xác định thêm.

Không tìm thấy checkbox hay tab (`[role=tab]`, `input[type=checkbox]`, `[role=switch]`) trên trang này.

## Chuyển động

- **Keyframes**: `breathe` (chấm trạng thái, chạy lặp, đang chạy khi tải trang), `flash` (dùng cho `.is-flash`).
- **Transition**: nav pill, tabbar pill, seg thumb, bars, chevron, checkbox, nút.
- **View Transition**: có rule `::view-transition-old/new(root)`, cần kiểm tra khi chuyển trang.
- **Cuộn**: không có thư viện animation (GSAP, Lenis, ...) được phát hiện. Hiệu ứng chủ yếu là CSS.

## Kế hoạch build

1. Dựng `AppShell` và route layout, kèm Sidebar, MobileTabbar và breakpoint.
2. Dựng các component nguyên tử: Button, IconButton, Card, PageHeader, SegmentedControl, Checkbox.
3. Dựng biểu đồ bằng SVG thuần, dữ liệu giả.
4. Ghép từng trang (route) theo cấu trúc trong mục layout.
5. Xác định class trạng thái mở của drawer mobile và lớp nền mờ, rồi đo hiệu ứng chi tiết.
   Tìm trang khác có checkbox và tab để đo.
6. Kiểm tra đối chiếu với bản chụp ở bốn viewport.

## Danh sách route (đã liệt kê từ link điều hướng)

Ghi chú: đây là cấu trúc điều hướng (tên route và tên mục), không phải nội dung trang. Số đếm là số hiển thị trên link.

| Route | Mục | Ghi chú |
|---|---|---|
| `/dashboard` | Tổng quan | Trang chính |
| `/inbox` | Hộp thư (3) | Có trang chi tiết tin nhắn `/inbox/inbox/:id` |
| `/calendar` | Lịch | |
| `/finance` | Tài chính (12) | Có `/finance/transactions` (chờ phân loại) và `/finance/cards` |
| `/accounts` | Tài khoản (5) | Có `/accounts/banks`, `/accounts/bills`, `/accounts/invoices/:id` |
| `/reports` | Báo cáo | |
| `/payroll` | HR & lương (3) | Có `/payroll/rota` và `/payroll/leave` |
| `/people` | Nhân sự | |
| `/contracts` | Hợp đồng (2) | Có `/contracts/licence` và `/contracts/signatures/:id` |
| `/settings` | Cài đặt | |
| `/help` | Trung tâm trợ giúp | |

Các trang chi tiết đã thấy: tin nhắn (6 mục mẫu), hóa đơn (2 mục mẫu), chữ ký hợp đồng (2 mục mẫu).

## Nguồn và giấy phép

Trang demo có liên kết "Buy this template" tới cửa hàng bán template. Đây là sản phẩm thương mại. Nếu dự án dùng template này, hãy mua và dùng bản gốc từ người bán, kèm source code và giấy phép của họ. Repo này không lưu source code gốc.
