// src/insights/data/numerology.rules.ts
//
// priority: core   = Life Path, Expression (xương sống, luôn đúng)
//           strong = Personal Year, Karmic Debt (quan trọng theo hoàn cảnh)
//           weak   = Balance, Hidden Passion (bổ sung nhẹ)
// tone:     positive = điểm mạnh | neutral = đặc điểm | warning = bài học/cảnh báo

import type { Insight } from "../types"

// ─────────────────────────────────────────────────────────────────────────────
// LIFE PATH 1–9 + Master 11/22/33
// ─────────────────────────────────────────────────────────────────────────────

export const LIFE_PATH_INSIGHTS: Record<number, Insight[]> = {
  1: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 1: bẩm sinh độc lập, có bản năng lãnh đạo và khả năng tự mở đường. Làm tốt nhất khi được tự quyết.", tags: ["leadership", "independence"] },
    { type: "career", source: "numerology", priority: "core", tone: "positive", weight: 8,
      content: "Phù hợp với vai trò khởi nghiệp, lãnh đạo hoặc làm chủ. Cần môi trường có không gian sáng tạo và tự chủ.", tags: ["leadership", "entrepreneurship"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 7,
      content: "Xu hướng quá độc lập đôi khi biến thành cứng đầu hoặc khó nhận sự giúp đỡ từ người khác.", tags: ["independence"] },
  ],
  2: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 2: nhạy cảm, tinh tế, có khả năng lắng nghe và đồng cảm tự nhiên. Là người xây cầu nối trong các mối quan hệ.", tags: ["empathy", "diplomacy"] },
    { type: "relationship", source: "numerology", priority: "core", tone: "positive", weight: 8,
      content: "Đặt tình cảm và sự hòa hợp lên cao. Có khả năng nuôi dưỡng mối quan hệ bền vững.", tags: ["partnership"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 7,
      content: "Dễ bị tổn thương khi bị phớt lờ. Cần học cách đặt giới hạn thay vì hy sinh quá mức.", tags: ["empathy"] },
  ],
  3: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 3: sáng tạo, biểu đạt tốt, dễ kết nối qua ngôn ngữ và nghệ thuật. Năng lượng xã hội mạnh.", tags: ["creativity", "expression"] },
    { type: "career", source: "numerology", priority: "core", tone: "positive", weight: 7,
      content: "Phù hợp với truyền thông, nghệ thuật biểu diễn, viết lách hoặc bất kỳ vai trò nào cần giao tiếp.", tags: ["creativity", "communication"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 6,
      content: "Dễ phân tán sức lực vào quá nhiều thứ cùng lúc. Cần kỷ luật để hoàn thành những gì đã bắt đầu.", tags: ["creativity"] },
  ],
  4: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 4: kiên định, kỷ luật cao, giỏi xây dựng hệ thống bền vững. Đáng tin cậy và thực tế.", tags: ["discipline", "structure"] },
    { type: "career", source: "numerology", priority: "core", tone: "positive", weight: 7,
      content: "Phù hợp với quản lý dự án, kỹ thuật, tài chính — bất kỳ lĩnh vực nào cần tổ chức và tính chính xác.", tags: ["discipline", "management"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 6,
      content: "Đôi khi quá cứng nhắc với kế hoạch, khó thích nghi khi hoàn cảnh thay đổi đột ngột.", tags: ["discipline"] },
  ],
  5: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 5: yêu tự do, thích thay đổi và trải nghiệm đa dạng. Thích ứng nhanh, có sức hút tự nhiên.", tags: ["freedom", "adaptability"] },
    { type: "career", source: "numerology", priority: "core", tone: "positive", weight: 7,
      content: "Phù hợp với du lịch, bán hàng, marketing — các ngành cần linh hoạt và tiếp xúc rộng.", tags: ["freedom", "versatility"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 7,
      content: "Dễ chán và bỏ cuộc giữa chừng. Thách thức lớn nhất là duy trì cam kết lâu dài.", tags: ["freedom"] },
  ],
  6: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 6: có trách nhiệm cao với gia đình và cộng đồng. Giỏi chăm sóc và tạo sự ổn định xung quanh.", tags: ["responsibility", "nurturing"] },
    { type: "relationship", source: "numerology", priority: "core", tone: "positive", weight: 8,
      content: "Đặt gia đình làm trung tâm. Thường là người giữ ổn định cảm xúc cho cả nhóm.", tags: ["family", "nurturing"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 6,
      content: "Dễ ôm đồm trách nhiệm của người khác dẫn đến kiệt sức. Cần học cách nói không.", tags: ["responsibility"] },
  ],
  7: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 7: tư duy sâu sắc, thích phân tích và tìm hiểu bản chất sự vật. Thấy những gì người khác bỏ qua.", tags: ["analytical", "depth"] },
    { type: "career", source: "numerology", priority: "core", tone: "positive", weight: 7,
      content: "Phù hợp với nghiên cứu, khoa học, triết học — bất kỳ lĩnh vực nào cần tư duy độc lập và chuyên sâu.", tags: ["research", "analytical"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 7,
      content: "Xu hướng suy nghĩ quá nhiều và tự cô lập bản thân. Cần chủ động duy trì kết nối với người xung quanh.", tags: ["depth"] },
  ],
  8: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 8: có tầm nhìn về quyền lực và vật chất. Mạnh mẽ trong kinh doanh, khả năng tổ chức và đạt thành tựu lớn.", tags: ["ambition", "leadership"] },
    { type: "finance", source: "numerology", priority: "core", tone: "positive", weight: 8,
      content: "Tiềm năng tài chính cao — khả năng tích lũy và quản lý tài sản vượt trội so với phần lớn các số khác.", tags: ["wealth", "ambition"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 7,
      content: "Dễ để tham vọng chi phối đến mức bỏ quên sức khỏe và mối quan hệ. Cần cân bằng vật chất và tinh thần.", tags: ["ambition"] },
  ],
  9: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 9,
      content: "Số đường đời 9: lý tưởng, tầm nhìn rộng và tấm lòng nhân ái. Thường cảm thấy có sứ mệnh đóng góp cho xã hội.", tags: ["humanitarian", "wisdom"] },
    { type: "relationship", source: "numerology", priority: "core", tone: "neutral", weight: 7,
      content: "Yêu thương rộng rãi nhưng đôi khi khó gắn bó sâu với một người. Tình yêu mang tính phổ quát hơn là riêng tư.", tags: ["humanitarian"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 6,
      content: "Dễ thất vọng khi thực tế không đạt đến lý tưởng. Cần học cách chấp nhận sự không hoàn hảo.", tags: ["humanitarian"] },
  ],
  11: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 10,
      content: "Số chủ 11: trực giác mạnh, nhạy cảm cao và khả năng truyền cảm hứng đặc biệt. Tiềm năng tinh thần vượt trội.", tags: ["intuition", "master-number"] },
    { type: "personality", source: "numerology", priority: "core", tone: "warning", weight: 8,
      content: "Năng lực lớn đi kèm áp lực nội tâm cao. Dễ lo âu nếu không học cách giữ nền tảng.", tags: ["intuition", "master-number"] },
  ],
  22: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 10,
      content: "Số chủ 22: nhà kiến trúc sư thực tế — có khả năng hiện thực hóa tầm nhìn lớn và tạo di sản lâu dài.", tags: ["master-builder", "master-number", "ambition"] },
    { type: "career", source: "numerology", priority: "core", tone: "warning", weight: 8,
      content: "Gánh nặng kỳ vọng lớn từ bản thân và người khác. Cần chấp nhận thất bại nhỏ trên đường đến mục tiêu lớn.", tags: ["master-number"] },
  ],
  33: [
    { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 10,
      content: "Số chủ 33: năng lượng phục vụ và chữa lành ở cấp độ cao nhất. Sứ mệnh gắn với giảng dạy hoặc dẫn dắt tinh thần.", tags: ["master-teacher", "master-number", "humanitarian"] },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPRESSION — priority: core
// ─────────────────────────────────────────────────────────────────────────────

export const EXPRESSION_INSIGHTS: Record<number, Insight> = {
  1: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 1: thể hiện qua sự tự tin và tiên phong. Người khác thấy mày là người dẫn đầu.", tags: ["leadership"] },
  2: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 2: thể hiện qua sự tinh tế và khéo léo trong kết nối. Điểm mạnh là ngoại giao và đồng cảm.", tags: ["diplomacy", "empathy"] },
  3: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 3: truyền đạt ý tưởng sáng tạo và thu hút. Người khác thấy mày thú vị và đầy năng lượng.", tags: ["creativity"] },
  4: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 4: thể hiện qua tính thực tế và đáng tin. Người khác coi mày là người đáng dựa vào.", tags: ["discipline", "structure"] },
  5: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 5: linh hoạt và đa năng. Người khác thấy mày năng động và luôn có ý tưởng mới.", tags: ["adaptability"] },
  6: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 6: toát ra sự ấm áp và trách nhiệm. Người xung quanh cảm thấy được chăm sóc và an toàn.", tags: ["nurturing", "responsibility"] },
  7: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 7: thể hiện qua chiều sâu tư duy. Người khác thấy mày sâu sắc và khó đoán.", tags: ["depth", "analytical"] },
  8: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 8: toát ra quyền lực tự nhiên. Người khác thấy mày có thẩm quyền trong kinh doanh.", tags: ["ambition", "leadership"] },
  9: { type: "personality", source: "numerology", priority: "core", tone: "positive", weight: 6, content: "Biểu đạt số 9: thể hiện qua tầm nhìn lớn và bao dung. Người khác cảm nhận được sự rộng lượng.", tags: ["humanitarian", "wisdom"] },
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSONAL YEAR — priority: strong
// ─────────────────────────────────────────────────────────────────────────────

export const PERSONAL_YEAR_INSIGHTS: Record<number, Insight> = {
  1: { type: "career",      source: "numerology", priority: "strong", tone: "positive", weight: 8, content: "Năm cá nhân 1 — năm khởi đầu: thích hợp để ra quyết định lớn và bắt đầu dự án mới. Đây là điểm khởi đầu chu kỳ 9 năm.", tags: ["new-beginning"] },
  2: { type: "relationship", source: "numerology", priority: "strong", tone: "neutral",  weight: 7, content: "Năm cá nhân 2 — năm hợp tác: kiên nhẫn chờ đợi, xây dựng quan hệ, không nên hành động một mình.", tags: ["partnership"] },
  3: { type: "career",      source: "numerology", priority: "strong", tone: "positive", weight: 7, content: "Năm cá nhân 3 — năm sáng tạo: mở rộng mạng lưới và biểu đạt bản thân. Năng lượng xã hội lên cao.", tags: ["creativity"] },
  4: { type: "career",      source: "numerology", priority: "strong", tone: "neutral",  weight: 7, content: "Năm cá nhân 4 — năm xây nền: tập trung làm việc chắc chắn và lập kế hoạch dài hạn.", tags: ["discipline"] },
  5: { type: "career",      source: "numerology", priority: "strong", tone: "neutral",  weight: 7, content: "Năm cá nhân 5 — năm thay đổi: nhiều biến động bất ngờ nhưng cũng nhiều cơ hội mới xuất hiện.", tags: ["freedom"] },
  6: { type: "relationship", source: "numerology", priority: "strong", tone: "positive", weight: 7, content: "Năm cá nhân 6 — năm gia đình: ưu tiên các mối quan hệ thân thiết. Thích hợp cho hôn nhân hoặc sinh con.", tags: ["family"] },
  7: { type: "health",      source: "numerology", priority: "strong", tone: "neutral",  weight: 7, content: "Năm cá nhân 7 — năm nội tâm: thích hợp để học hỏi và lắng nghe bản thân. Không phải năm để đua tranh.", tags: ["introspective"] },
  8: { type: "finance",     source: "numerology", priority: "strong", tone: "positive", weight: 8, content: "Năm cá nhân 8 — năm gặt hái: nỗ lực được ghi nhận, cơ hội tài chính và sự nghiệp rõ nét.", tags: ["wealth", "ambition"] },
  9: { type: "personality", source: "numerology", priority: "strong", tone: "warning",  weight: 7, content: "Năm cá nhân 9 — năm kết thúc: cần buông bỏ những gì không còn phù hợp. Giữ lại sẽ cản trở chu kỳ mới.", tags: ["humanitarian"] },
}

// ─────────────────────────────────────────────────────────────────────────────
// KARMIC DEBT — priority: strong
// ─────────────────────────────────────────────────────────────────────────────

export const KARMIC_DEBT_INSIGHTS: Record<number, Insight> = {
  13: { type: "personality", source: "numerology", priority: "strong", tone: "warning", weight: 7,
        content: "Nghiệp số 13: bài học về lao động và kiên trì. Tránh tìm đường tắt — thành công thật đến từ nỗ lực bền bỉ.", tags: ["discipline"] },
  14: { type: "personality", source: "numerology", priority: "strong", tone: "warning", weight: 7,
        content: "Nghiệp số 14: bài học về kiểm soát bản thân. Cần cân bằng giữa tự do và trách nhiệm, tránh thái quá.", tags: ["freedom"] },
  16: { type: "relationship", source: "numerology", priority: "strong", tone: "warning", weight: 7,
        content: "Nghiệp số 16: bài học về cái tôi và sự khiêm nhường. Các mối quan hệ là gương để nhận ra điểm mù của bản thân.", tags: ["depth"] },
  19: { type: "personality", source: "numerology", priority: "strong", tone: "warning", weight: 7,
        content: "Nghiệp số 19: bài học về việc nhận sự giúp đỡ. Tự lập quá mức sẽ dẫn đến cô lập không cần thiết.", tags: ["independence"] },
}
