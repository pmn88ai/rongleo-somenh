import type { EarthlyBranch } from "@/lib/astrology/sexagenaryCycle/types"

export const zodiacCompatibility: Record<EarthlyBranch, {
  tamHop:     EarthlyBranch[]
  lucHop:     EarthlyBranch
  tuHanhXung: EarthlyBranch[]
}> = {
  "Tý":   { tamHop:["Thìn","Thân"],      lucHop:"Sửu",  tuHanhXung:["Mão","Ngọ","Dậu"]  },
  "Sửu":  { tamHop:["Tỵ","Dậu"],         lucHop:"Tý",   tuHanhXung:["Thìn","Mùi","Tuất"]},
  "Dần":  { tamHop:["Ngọ","Tuất"],        lucHop:"Hợi",  tuHanhXung:["Tỵ","Thân","Hợi"]  },
  "Mão":  { tamHop:["Mùi","Hợi"],         lucHop:"Tuất", tuHanhXung:["Tý","Ngọ","Dậu"]   },
  "Thìn": { tamHop:["Tý","Thân"],         lucHop:"Dậu",  tuHanhXung:["Sửu","Mùi","Tuất"] },
  "Tỵ":   { tamHop:["Sửu","Dậu"],         lucHop:"Thân", tuHanhXung:["Dần","Thân","Hợi"]  },
  "Ngọ":  { tamHop:["Dần","Tuất"],        lucHop:"Mùi",  tuHanhXung:["Tý","Mão","Dậu"]   },
  "Mùi":  { tamHop:["Mão","Hợi"],         lucHop:"Ngọ",  tuHanhXung:["Sửu","Thìn","Tuất"]},
  "Thân": { tamHop:["Tý","Thìn"],         lucHop:"Tỵ",   tuHanhXung:["Dần","Tỵ","Hợi"]   },
  "Dậu":  { tamHop:["Sửu","Tỵ"],          lucHop:"Thìn", tuHanhXung:["Tý","Mão","Ngọ"]   },
  "Tuất": { tamHop:["Dần","Ngọ"],         lucHop:"Mão",  tuHanhXung:["Sửu","Thìn","Mùi"] },
  "Hợi":  { tamHop:["Mão","Mùi"],         lucHop:"Dần",  tuHanhXung:["Dần","Tỵ","Thân"]  },
}
