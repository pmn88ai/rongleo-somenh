export type BaTrachEnergy    = "Sinh Khí"|"Thiên Y"|"Diên Niên"|"Phục Vị"|"Tuyệt Mệnh"|"Ngũ Quỷ"|"Lục Sát"|"Họa Hại"
export type CompassDirection = "Bắc"|"Nam"|"Đông"|"Tây"|"Đông Bắc"|"Tây Bắc"|"Đông Nam"|"Tây Nam"

export const baTrachDirections: Record<string, Record<CompassDirection, BaTrachEnergy>> = {
  "Khảm": { "Đông Nam":"Sinh Khí","Đông":"Thiên Y","Nam":"Diên Niên","Bắc":"Phục Vị",   "Tây":"Tuyệt Mệnh","Đông Bắc":"Ngũ Quỷ","Tây Bắc":"Lục Sát","Tây Nam":"Họa Hại" },
  "Khôn": { "Đông Bắc":"Sinh Khí","Tây":"Thiên Y","Tây Bắc":"Diên Niên","Tây Nam":"Phục Vị","Đông":"Tuyệt Mệnh","Đông Nam":"Ngũ Quỷ","Bắc":"Lục Sát","Nam":"Họa Hại" },
  "Chấn": { "Nam":"Sinh Khí","Đông Nam":"Thiên Y","Bắc":"Diên Niên","Đông":"Phục Vị",   "Tây Nam":"Tuyệt Mệnh","Tây":"Ngũ Quỷ","Đông Bắc":"Lục Sát","Tây Bắc":"Họa Hại" },
  "Tốn":  { "Bắc":"Sinh Khí","Nam":"Thiên Y","Đông":"Diên Niên","Đông Nam":"Phục Vị",   "Tây Bắc":"Tuyệt Mệnh","Đông Bắc":"Ngũ Quỷ","Tây Nam":"Lục Sát","Tây":"Họa Hại" },
  "Càn":  { "Tây":"Sinh Khí","Đông Bắc":"Thiên Y","Tây Nam":"Diên Niên","Tây Bắc":"Phục Vị","Đông":"Tuyệt Mệnh","Nam":"Ngũ Quỷ","Đông Nam":"Lục Sát","Bắc":"Họa Hại" },
  "Đoài": { "Đông Bắc":"Sinh Khí","Tây Bắc":"Thiên Y","Tây Nam":"Diên Niên","Tây":"Phục Vị","Đông":"Tuyệt Mệnh","Nam":"Ngũ Quỷ","Bắc":"Lục Sát","Đông Nam":"Họa Hại" },
  "Cấn":  { "Tây Nam":"Sinh Khí","Tây":"Thiên Y","Đông Bắc":"Diên Niên","Tây Bắc":"Phục Vị","Nam":"Tuyệt Mệnh","Bắc":"Ngũ Quỷ","Đông":"Lục Sát","Đông Nam":"Họa Hại" },
  "Ly":   { "Đông":"Sinh Khí","Bắc":"Thiên Y","Đông Nam":"Diên Niên","Nam":"Phục Vị",   "Tây Bắc":"Tuyệt Mệnh","Tây Nam":"Ngũ Quỷ","Tây":"Lục Sát","Đông Bắc":"Họa Hại" },
}
