insert into my_store.role (url, description, manage, action) values 
("/group/read", "view group", "group", "view"),
("/group/create", "create group", "group", "create"),
("/group/update", "update group", "group", "update"),
("/group/delete", "delete group", "group", "delete"),

("/user/read", "view user", "user", "view"),
("/user/create", "create user", "user", "create"),
("/user/update", "update user", "user", "update"),
("/user/delete", "delete user", "user", "delete"),

("/category/read", "view category", "category", "view"),
("/category/create", "create category", "category", "create"),
("/category/update", "update category", "category", "update"),
("/category/delete", "delete category", "category", "delete"),

("/brand/read", "view brand", "brand", "view"),
("/brand/create", "create brand", "brand", "create"),
("/brand/update", "update brand", "brand", "update"),
("/brand/delete", "delete brand", "brand", "delete"),

("/attributes/read", "view attributes", "attribute", "view"),
("/attributes/create", "create attributes", "attribute", "create"),
("/attributes/update", "update attributes", "attribute", "update"),
("/attributes/delete", "delete attributes", "attribute", "delete"),

("/attributes/read-value", "view value", "attribute value", "view"),
("/attributes/create-value", "create value", "attribute value", "create"),
("/attributes/update-value", "update value", "attribute value", "update"),
("/attributes/delete-value", "delete value", "attribute value", "delete"),

("/products/read", "view product", "product", "view"),
("/products/create", "create product", "product", "create"),
("/products/update", "update product", "product", "update"),
("/products/delete", "delete product", "product", "delete"),

("/variants/read", "view variant", "variant", "view"),
("/variants/create", "create variant", "variant", "create"),
("/variants/update", "update variant", "variant", "update"),
("/variants/delete", "delete variant", "variant", "delete"),

("/images/read", "view image", "image", "view"),
("/images/create", "create image", "image", "create"),
("/images/update", "update image", "image", "update"),
("/images/delete", "delete image", "image", "delete"),

("/orders/read", "view order", "order", "view"),
("/orders/create", "create order", "order", "create"),
("/orders/update", "update order", "order", "update"),
("/orders/delete", "delete order", "order", "delete")
;

insert into my_store.group(label, description) values
("ROLE_ADMIN", "admin is here"),
("ROLE_CUSTOMER", "customer is here")

;

insert into my_store.group_role(group_id, role_id) values
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),
(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),
(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),
(2,	9),(2,13),(2,17),(2,21),(2,25),(2,29),(2,33),(2,37)

;

insert into my_store.user(username, email, phone, address, password, group_id)
values
("admin", "admin@gmail.com", "0123456789", "HN", "$2b$10$H8BaS6.Krhs3seEobvdrNeoqMwt3aEbLMhBoZwlIqtNIazth1h.su", 1),
("user1", "user1@gmail.com", "0123456xxx", "HCM", "$2b$10$32KZF4ho44Omd.1gzRlzT./1xmCHr25mNQyXJvJ/2VvkGsIRu30Aq", 2)

;

insert into my_store.category(label, slug, icon_url, icon_name, image_url, image_name)
values
("điện thoại", "dien-thoai", 
"https://res.cloudinary.com/dakwksab6/image/upload/v1703754933/cuahangdientu/mqpjeqtvluyt7mjztgf8.png", 
"cuahangdientu/mqpjeqtvluyt7mjztgf8",
"https://res.cloudinary.com/dakwksab6/image/upload/v1703754935/cuahangdientu/rpaqspauzvbr6rlfgbfn.webp", 
"cuahangdientu/rpaqspauzvbr6rlfgbfn"),
("laptop", "may-tinh-xach-tay",
"https://res.cloudinary.com/dakwksab6/image/upload/v1703756553/cuahangdientu/so9zxb5gge5sedgskfqg.png",
"cuahangdientu/so9zxb5gge5sedgskfqg",
"https://res.cloudinary.com/dakwksab6/image/upload/v1703756554/cuahangdientu/qqhumvntupkcof4wddna.webp",
"cuahangdientu/qqhumvntupkcof4wddna"),
("máy tính bảng", "may-tinh-bang",
"https://res.cloudinary.com/dakwksab6/image/upload/v1703756575/cuahangdientu/dtfxi2yle0h8kekdddez.png",
"cuahangdientu/dtfxi2yle0h8kekdddez",
"https://res.cloudinary.com/dakwksab6/image/upload/v1703756576/cuahangdientu/ytjhbj0wajz1kz3hmw8d.webp",
"cuahangdientu/ytjhbj0wajz1kz3hmw8d"),
("phụ kiện", "linh-phu-kien",
"https://res.cloudinary.com/dakwksab6/image/upload/v1703757483/cuahangdientu/onmixivahgtv0ctapbir.png",
"cuahangdientu/onmixivahgtv0ctapbir",
"https://res.cloudinary.com/dakwksab6/image/upload/v1703757484/cuahangdientu/ypm594p5zwirojzpxhv7.webp",
"cuahangdientu/ypm594p5zwirojzpxhv7")
;

insert into my_store.brand(label, slug, category_id)
values
("apple (iphone)", "apple-iphone", 1),
("samsung", "samsung", 1),
("oppo", "oppo", 1),
("xiaomi", "xiaomi", 1),
("honor", "honor", 1),
("realme", "realme", 1),
("vivo", "vivo", 1),
("asus", "asus", 1),
("masstel", "masstel", 1),
("nokia", "nokia", 1),

("apple (macbook)", "apple-macbook", 2),
("asus", "dell", 2),
("hp", "hp", 2),
("lenovo", "asus", 2),
("acer", "msi", 2),
("MSI", "acer", 2),
("dell", "acer", 2),
("gigabyte", "acer", 2),
("microsoft (surface)", "acer", 2),

("apple (ipad)", "apple-ipad", 3),
("samsung", "samsung", 3),
("msstel", "msstel", 3),
("lenovo", "lenovo", 3),
("xiaomi", "xiaomi", 3),
("coolpad", "coolpad", 3),
("oppo", "oppo", 3),

("apple", "apple", 4),
("samsung", "samsung", 4),
("ugreen", "ugreen", 4),
("baseus", "baseus", 4),
("anker", "anker", 4),
("sony", "sony", 4),
("logitech", "logitech", 4),
("asus", "asus", 4),
("tp-link", "tp-link", 4),
("sandisk", "sandisk", 4),
("kingston", "kingston", 4)

;

insert into my_store.attribute(label, slug, category_id)
values
("Mức giá", "muc-gia", 1),
("Loại điện thoại", "loai-dien-thoai", 1),
("Chip xử lý", "chip-xu-ly", 1),
("Dung lượng RAM", "dung-luong-ram", 1),
("Bộ nhớ trong", "bo-nho-trong", 1),
("Kích thước màn hình", "kich-thuoc-man-hinh", 1),

("Mức giá", "muc-gia", 2),
("CPU", "cpu", 2),
("Dung lượng RAM", "dung-luong-ram", 2),
("Kích thước màn hình", "kich-thuoc-man-hinh", 2),
("Card đồ họa", "card-do-hoa", 2),
("Ổ cứng", "o-cung", 2),

("Mức giá", "muc-gia", 3),
("Hệ điều hành", "he-dieu-hanh", 3),
("Chip xử lý", "chip-xu-ly", 3),
("Bộ nhớ trong", "bo-nho-trong", 3),
("Kích thước màn hình", "kich-thuoc-man-hinh", 3),

("Phụ kiện điện thoại", "phu-kien-dien-thoai", 4),
("Phụ kiện laptop", "phu-kien-laptop", 4),
("Thiết bị mạng", "thiet-bi-mang", 4),
("Thiết bị lưu trữ", "thiet-bi-luu-tru", 4),
("Phụ kiện khác", "phu-kien-khac", 4)

;

insert into my_store.attribute_value(label, slug, attribute_id)
values
("Dưới 2 triệu", "duoi-2-trieu", 1),
("Từ 2 - 4 triệu", "tu-2-4-trieu", 1),
("Từ 4 - 7 triệu", "tu-4-7-trieu", 1),
("Từ 7 - 13 triệu", "tu-7-13-trieu", 1),
("Trên 13 triệu", "tren-13-trieu", 1),

("iPhone (iOS)", "iphone-ios", 2),
("Android", "android", 2),
("Điện thoại phổ thông", "dien-thoai-pho-thong", 2),

("Snapdragon", "snapdragon", 3),
("Apple A", "apple-a", 3),
("Mediatek Dimensity", "mediatek-dimensity", 3),
("Mediatek Helio", "mediatek-helio", 3),
("Exynos", "exynos", 3),

("Dưới 4GB", "duoi-4-gb", 4),
("4GB - 6GB", "4gb-6-gb", 4),
("8GB - 12GB", "8gb-12-gb", 4),
("12GB trở lên", "12-gb-tro-len", 4),

("128GB", "128-gb", 5),
("256GB", "256-gb", 5),
("512GB", "512-gb", 5),
("512GB trở lên", "512-gb-tro-len", 5),

("Trên 6 inch", "tren-6-inch", 6),
("Dưới 6 inch", "duoi-6-inch", 6),

("Dưới 10 triệu", "duoi-10-trieu", 7),
("Từ 10 - 15 triệu", "tu-10-15-trieu", 7),
("Từ 15 - 20 triệu", "tu-15-20-trieu", 7),
("Từ 20 - 25 triệu", "tu-20-25-trieu", 7),
("Trên 25 triệu", "tren-25-trieu", 7),

("Intel core i3", "intel-core-i3", 8),
("Intel core i5", "intel-core-i5", 8),
("Intel core i7", "intel-core-i7", 8),
("Amd ryzen 3", "amd-ryzen-3", 8),
("Amd ryzen 5", "amd-ryzen-5", 8),
("Amd ryzen 7", "amd-ryzen-7", 8),

("4GB", "4-gb", 9),
("8GB", "8-gb", 9),
("16GB", "16-gb", 9),
("32GB", "32-gb", 9),

("Khoảng 13 inch", "khoang-13-inch", 10),
("Khoảng 14 inch", "khoang-14-inch", 10),
("Trên 15 inch", "tren-15-inch", 10),

("Nvidia geforce series", "nvidia-geforce-series", 11),
("Amd radeon series", "amd-radeon-series", 11),
("Card onboard", "card-onboard", 11),

("SSD 256GB", "ssd-256-gb", 12),
("SSD 512GB", "ssd-512-gb", 12),
("SSD 1TB", "ssd-1-tb", 12),

("Dưới 13 triệu", "duoi-13-trieu", 13),
("Từ 3 - 8 triệu", "tu-3-8-trieu", 13),
("Từ 8 - 15 triệu", "tu-8-15-trieu", 13),
("Trên 15 triệu", "tren-15-trieu", 13),

("iPadOS", "ipad-os", 14),
("Android", "android", 14),
("HarmonyOS", "harmony-os", 14),

("Apple A-series", "apple-a-series", 15),
("Snapdragon", "snapdragon", 15),
("Apple M1", "apple-m1", 15),
("Apple M2", "apple-m2", 15),

("Dưới 64 GB", "duoi-64-gb", 16),
("Từ 64 - 256 GB", "tu-64-256-gb", 16),
("Trên 256 GB", "tren-256-gb", 16),

("Khoảng 7 - 8 inch", "khoang-7-8-inch", 17),
("Khoảng 10 - 11 inch", "khoang-10-11-inch", 17),
("Khoảng 12 inch trở lên", "khoang-12-inch-tro-len", 17),

("Cáp, sạc", "cap-sac", 18),
("Pin dự phòng", "pin-du-phong", 18),
("Tai nghe", "tai-nghe", 18),

("Chuột", "chuot", 19),
("Bàn phím", "ban-phim", 19),
("Webcam", "webcam", 19),

("Router", "router", 20),
("Wifi Mesh", "wifi-mesh", 20),
("Hub-Switch", "hub-switch", 20),

("Thẻ nhớ", "the-nho", 21),
("USB", "usb", 21),
("Ổ cứng di động", "o-cung-di-dong", 21),

("Bút cảm ứng", "but-cam-ung", 22),
("Dây đeo đồng hồ", "day-deo-dong-ho", 22)

;

