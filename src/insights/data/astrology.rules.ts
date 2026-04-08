// src/insights/data/astrology.rules.ts
// priority: core = Ngũ Hành (từ Can năm sinh — xương sống)
//           strong = Con giáp, Western Zodiac
//           weak = Cung Phi (Feng Shui — theo hoàn cảnh)

import type { Insight } from "../types"

// ─────────────────────────────────────────────────────────────────────────────
// NGŨ HÀNH — priority: core
// source: profile.astrology.element
// Giá trị: "Mộc" | "Hỏa" | "Thổ" | "Kim" | "Thủy"
// ─────────────────────────────────────────────────────────────────────────────

export const ELEMENT_INSIGHTS: Record<string, Insight[]> = {
  "Mộc": [
    { type: "personality", source: "astrology", priority: "core", tone: "positive", weight: 7,
      content: "Mệnh Mộc: linh hoạt, có tinh thần phát triển và mở rộng. Giỏi nuôi dưỡng ý tưởng và con người xung quanh.", tags: ["growth", "adaptability"] },
    { type: "health", source: "astrology", priority: "core", tone: "neutral", weight: 5,
      content: "Hành Mộc liên quan đến gan và mật. Kiểm soát căng thẳng là yếu tố quan trọng để giữ sức khỏe.", tags: ["health"] },
  ],
  "Hỏa": [
    { type: "personality", source: "astrology", priority: "core", tone: "positive", weight: 7,
      content: "Mệnh Hỏa: nhiệt huyết, đam mê và có sức thu hút tự nhiên. Giỏi truyền cảm hứng và hành động quyết đoán.", tags: ["passion", "charisma", "leadership"] },
    { type: "health", source: "astrology", priority: "core", tone: "neutral", weight: 5,
      content: "Hành Hỏa liên quan đến tim và hệ tuần hoàn. Không để cảm xúc kích động quá mức kéo dài.", tags: ["health"] },
  ],
  "Thổ": [
    { type: "personality", source: "astrology", priority: "core", tone: "positive", weight: 7,
      content: "Mệnh Thổ: ổn định, đáng tin cậy và có khả năng nuôi dưỡng môi trường xung quanh. Là trụ cột cho những người thân.", tags: ["stability", "responsibility"] },
    { type: "health", source: "astrology", priority: "core", tone: "neutral", weight: 5,
      content: "Hành Thổ liên quan đến hệ tiêu hóa. Chú ý chế độ ăn uống và không để lo lắng tích tụ lâu ngày.", tags: ["health"] },
  ],
  "Kim": [
    { type: "personality", source: "astrology", priority: "core", tone: "positive", weight: 7,
      content: "Mệnh Kim: kỷ luật, rõ ràng và có khả năng tổ chức tốt. Giỏi phân tích và đưa ra quyết định dứt khoát.", tags: ["discipline", "analytical"] },
    { type: "health", source: "astrology", priority: "core", tone: "neutral", weight: 5,
      content: "Hành Kim liên quan đến phổi và hệ hô hấp. Chú ý chất lượng không khí và tránh để nỗi buồn kéo dài.", tags: ["health"] },
  ],
  "Thủy": [
    { type: "personality", source: "astrology", priority: "core", tone: "positive", weight: 7,
      content: "Mệnh Thủy: linh hoạt, thích nghi nhanh và có chiều sâu nội tâm. Giỏi cảm nhận và chảy theo hoàn cảnh.", tags: ["adaptability", "depth"] },
    { type: "health", source: "astrology", priority: "core", tone: "neutral", weight: 5,
      content: "Hành Thủy liên quan đến thận và hệ sinh dục. Chú ý giữ ấm và không để sợ hãi tích tụ lâu dài.", tags: ["health"] },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 12 CON GIÁP — priority: strong
// source: profile.astrology.animal
// ─────────────────────────────────────────────────────────────────────────────

export const ANIMAL_INSIGHTS: Record<string, Insight> = {
  "Chuột":  { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Tý (Chuột): thông minh, nhạy bén và giỏi thích nghi. Có bản năng sinh tồn mạnh và tư duy linh hoạt.", tags: ["clever", "adaptability"] },
  "Trâu":   { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Sửu (Trâu): kiên nhẫn, chăm chỉ và đáng tin. Ít nói nhưng làm nhiều — xây dựng thành công từng bước chắc chắn.", tags: ["discipline", "stability"] },
  "Hổ":     { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Dần (Hổ): dũng cảm, cạnh tranh và có sức lôi cuốn tự nhiên. Không chịu đứng yên — luôn tìm thách thức mới.", tags: ["leadership", "ambition"] },
  "Mèo":    { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Mão (Mèo): tinh tế, khéo léo và có gu thẩm mỹ. Thích sự yên tĩnh và môi trường hài hòa.", tags: ["diplomacy", "stability"] },
  "Rồng":   { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Thìn (Rồng): tự tin, có sức hút và tư duy lớn. Sinh ra để dẫn đầu — dễ chán những việc tầm thường.", tags: ["leadership", "ambition"] },
  "Rắn":    { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Tỵ (Rắn): sâu sắc, trực giác mạnh và chiến lược. Không hành động bốc đồng — suy tính kỹ trước khi ra tay.", tags: ["depth", "analytical"] },
  "Ngựa":   { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Ngọ (Ngựa): tự do, năng động và đầy nhiệt huyết. Ghét bị ràng buộc — cần không gian và sự thay đổi liên tục.", tags: ["freedom", "passion"] },
  "Dê":     { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Mùi (Dê): nhạy cảm, sáng tạo và có tâm hồn nghệ thuật. Làm tốt nhất khi được bảo vệ và an toàn.", tags: ["creativity", "empathy"] },
  "Khỉ":    { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Thân (Khỉ): thông minh, nhanh nhạy và đa tài. Giỏi giải quyết vấn đề nhưng dễ mất tập trung.", tags: ["clever", "adaptability"] },
  "Gà":     { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Dậu (Gà): tỉ mỉ, có nguyên tắc và chú ý đến chi tiết. Đề cao sự trật tự và hoàn hảo.", tags: ["discipline", "analytical"] },
  "Chó":    { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Tuất (Chó): trung thành, công bằng và có tinh thần bảo vệ. Người thân tin tưởng tuyệt đối.", tags: ["responsibility", "stability"] },
  "Lợn":    { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Tuổi Hợi (Lợn): hào phóng, chân thành và tấm lòng rộng mở. Dễ tin người — cần học cách đặt giới hạn.", tags: ["nurturing", "humanitarian"] },
}

// ─────────────────────────────────────────────────────────────────────────────
// WESTERN ZODIAC — priority: strong
// source: profile.westernAstrology.zodiacSign (English)
// ─────────────────────────────────────────────────────────────────────────────

export const WESTERN_ZODIAC_INSIGHTS: Record<string, Insight> = {
  "Aries":       { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Bạch Dương: tiên phong, quyết đoán và đầy năng lượng. Không ngại đương đầu — luôn là người xông vào trước.", tags: ["leadership", "ambition"] },
  "Taurus":      { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Kim Ngưu: kiên định, yêu sự ổn định và có gu thẩm mỹ tinh tế. Trân trọng giá trị vật chất và tinh thần bền vững.", tags: ["stability", "discipline"] },
  "Gemini":      { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Song Tử: tò mò, đa chiều và giỏi giao tiếp. Xử lý nhiều ý tưởng cùng lúc — đôi khi khó tập trung lâu dài.", tags: ["creativity", "adaptability"] },
  "Cancer":      { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Cự Giải: nhạy cảm sâu sắc và có bản năng bảo vệ gia đình mạnh. Nội tâm phong phú — cần thời gian để mở lòng.", tags: ["empathy", "nurturing"] },
  "Leo":         { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Sư Tử: tự tin, hào phóng và có sức thu hút tự nhiên. Yêu sự công nhận và luôn muốn để lại dấu ấn.", tags: ["leadership", "charisma"] },
  "Virgo":       { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Xử Nữ: phân tích, tỉ mỉ và có tinh thần phục vụ cao. Giỏi nhìn ra lỗi sai — cần học cách chấp nhận sự không hoàn hảo.", tags: ["analytical", "discipline"] },
  "Libra":       { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Thiên Bình: yêu sự công bằng, cân bằng và cái đẹp. Giỏi hòa giải — đôi khi khó ra quyết định dứt khoát.", tags: ["diplomacy", "stability"] },
  "Scorpio":     { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Bọ Cạp: cường độ cảm xúc cao, trực giác sắc bén và ý chí mạnh mẽ. Không bỏ cuộc — luôn tìm đến tận cùng sự thật.", tags: ["depth", "ambition"] },
  "Sagittarius": { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Nhân Mã: phóng khoáng, lạc quan và ham học hỏi. Luôn tìm kiếm ý nghĩa lớn hơn — không thích bị gò bó.", tags: ["freedom", "wisdom"] },
  "Capricorn":   { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Ma Kết: kỷ luật, tham vọng và tư duy dài hạn. Xây dựng chậm nhưng chắc — thành công đến muộn nhưng bền vững.", tags: ["discipline", "ambition"] },
  "Aquarius":    { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Bảo Bình: độc lập, đổi mới và có tầm nhìn vượt thời đại. Thường đi trước người khác một bước về tư duy.", tags: ["independence", "humanitarian"] },
  "Pisces":      { type: "personality", source: "astrology", priority: "strong", tone: "positive", weight: 6, content: "Song Ngư: trực giác, đồng cảm và có thế giới nội tâm phong phú. Dễ hấp thụ cảm xúc người khác — cần bảo vệ năng lượng bản thân.", tags: ["empathy", "depth"] },
}

// ─────────────────────────────────────────────────────────────────────────────
// CUNG PHI BÁT TRẠCH — priority: weak (bổ sung, không phải cốt lõi)
// source: profile.fengShui?.cungPhi
// ─────────────────────────────────────────────────────────────────────────────

export const CUNG_PHI_INSIGHTS: Record<string, Insight> = {
  "Khảm": { type: "career", source: "fengshui", priority: "weak", tone: "neutral", weight: 5, content: "Cung Khảm (Đông Tứ Mệnh): hướng tốt là Đông, Đông Nam, Nam, Bắc. Ngành liên quan nước, giao thông, truyền thông phù hợp.", tags: [] },
  "Khôn": { type: "career", source: "fengshui", priority: "weak", tone: "neutral", weight: 5, content: "Cung Khôn (Tây Tứ Mệnh): hướng tốt là Tây, Tây Bắc, Đông Bắc, Tây Nam. Phù hợp bất động sản, nông nghiệp.", tags: [] },
  "Chấn": { type: "career", source: "fengshui", priority: "weak", tone: "neutral", weight: 5, content: "Cung Chấn (Đông Tứ Mệnh): hướng tốt là Đông, Đông Nam, Nam, Bắc. Phù hợp y tế, giáo dục, ngành gỗ.", tags: [] },
  "Tốn":  { type: "career", source: "fengshui", priority: "weak", tone: "neutral", weight: 5, content: "Cung Tốn (Đông Tứ Mệnh): hướng tốt là Đông, Đông Nam, Nam, Bắc. Phù hợp thời trang, nghệ thuật, truyền thông.", tags: [] },
  "Càn":  { type: "career", source: "fengshui", priority: "weak", tone: "neutral", weight: 5, content: "Cung Càn (Tây Tứ Mệnh): hướng tốt là Tây, Tây Bắc, Đông Bắc, Tây Nam. Phù hợp tài chính, quản lý, lãnh đạo.", tags: [] },
  "Đoài": { type: "career", source: "fengshui", priority: "weak", tone: "neutral", weight: 5, content: "Cung Đoài (Tây Tứ Mệnh): hướng tốt là Tây, Tây Bắc, Đông Bắc, Tây Nam. Phù hợp ngoại giao, kinh doanh dịch vụ.", tags: [] },
  "Cấn":  { type: "career", source: "fengshui", priority: "weak", tone: "neutral", weight: 5, content: "Cung Cấn (Tây Tứ Mệnh): hướng tốt là Tây, Tây Bắc, Đông Bắc, Tây Nam. Phù hợp xây dựng, bất động sản.", tags: [] },
  "Ly":   { type: "career", source: "fengshui", priority: "weak", tone: "neutral", weight: 5, content: "Cung Ly (Đông Tứ Mệnh): hướng tốt là Đông, Đông Nam, Nam, Bắc. Phù hợp văn hóa, nghệ thuật, giáo dục.", tags: [] },
}
