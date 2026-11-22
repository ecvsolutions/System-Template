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

Ghi chú: breakpoint giữa desktop (248) và laptop (84) nằm trong khoảng 1024–1440. Chưa đo chính xác ngưỡng. Cần đo thêm khoảng 1200 và 1280.

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
| Sidebar | Điều hướng, có chế độ đầy đủ và rail | Breakpoint giữa 1024 và 1440 |
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
| SegmentedControl | Chọn một trong nhiều | `seg`, `seg__thumb` |
| Checkbox | Checkbox dạng switch | `check`, `aria-checked` |
| StatusDot | Chấm trạng thái nhấp nháy | `tonight__dot`, `steps__dot` |

## Trạng thái hover (đã đo)

| Phần tử | Trạng thái | Thay đổi đo được | Thời lượng |
|---|---|---|---|
| `.btn--primary` | hover | Nền từ rgb(14,108,132) sang rgb(18,125,152), transform gần 0 | khoảng 0.8s (theo transition) |
| `.btn--ghost` | hover | Nền từ trong suốt sang rgba(23,37,45,0.043) | khoảng 0.8s |
| `.nav__pill` | hover | Không đổi ở các thuộc tính đã đo | — |
| `.seg` | click | Không đổi khi click vào thumb đang chọn. Cần click vào option khác để đo | — |

Chưa đo: hover trên `.card`, click trên tab và checkbox, và trạng thái khi mở drawer mobile. Cần chọn selector cụ thể hơn để đo.

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
5. Đo thêm breakpoint 1200–1280, drawer mobile và các hover còn lại trước khi viết chuyển động chi tiết.
6. Kiểm tra đối chiếu với bản chụp ở bốn viewport.
