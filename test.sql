insert into my_store.role (url, description) values 
("/group/read", "view group"),
("/group/create", "create group"),
("/group/update", "update group"),
("/group/delete", "delete group"),
("/user/read", "view user"),
("/user/create", "create user"),
("/user/update", "update user"),
("/user/delete", "delete user"),
("/category/read", "view category"),
("/category/create", "create category"),
("/category/update", "update category"),
("/category/delete", "delete category"),
("/brand/read", "view brand"),
("/brand/create", "create brand"),
("/brand/update", "update brand"),
("/brand/delete", "delete brand"),
("/attributes/read", "view attributes"),
("/attributes/create", "create attributes"),
("/attributes/update", "update attributes"),
("/attributes/delete", "delete attributes"),
("/attributes/read-value", "view value"),
("/attributes/create-value", "create value"),
("/attributes/update-value", "update value"),
("/attributes/delete-value", "delete value"),
("/products/read", "view product"),
("/products/create", "create product"),
("/products/update", "update product"),
("/products/delete", "delete product"),
("/variants/read", "view variant"),
("/variants/create", "create variant"),
("/variants/update", "update variant"),
("/variants/delete", "delete variant"),
("/images/read", "view image"),
("/images/create", "create image"),
("/images/update", "update image"),
("/images/delete", "delete image"),
("/orders/read", "view order"),
("/orders/create", "create order"),
("/orders/update", "update order"),
("/orders/delete", "delete order")
;

insert into my_store.group(label, description) values
("ROLE_ADMIN", "admin is here")
;

insert into my_store.group_role(group_id, role_id) values
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),
(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),
(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40)
;

insert into my_store.user(username, email, phone, address, password, group_id)
values
("admin", "admin@gmail.com", "0123456789", "HN", "$2b$10$H8BaS6.Krhs3seEobvdrNeoqMwt3aEbLMhBoZwlIqtNIazth1h.su", 1)
;

insert into my_store.category(label, slug)
values
("điện thoại", "dien-thoai"),
("laptop", "may-tinh-xach-tay"),
("máy tính bảng", "may-tinh-bang"),
("phụ kiện", "linh-phu-kien")
;

insert into my_store.brand(label, slug, category_id)
values
("apple(iphone)", "apple-iphone", 1),
("samsung", "samsung", 1),
("oppo", "oppo", 1),
("xiaomi", "xiaomi", 1),
("apple(macbook)", "apple-ipad", 2),
("dell", "dell", 2),
("hp", "hp", 2),
("asus", "asus", 2),
("apple(ipad)", "apple-ipad", 3),
("samsung", "samsung", 3),
("xiaomi", "xiaomi", 3),
("oppo", "oppo", 3)
;
