"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { InquiryDto } from "@/types/sales";
import { salesService } from "@/services/salesService";

export default function SalesInquiryDetailPage() {
  const params = useParams();
  const inquiryId = params?.id as string;
  const [inquiry, setInquiry] = useState<InquiryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await salesService.getInquiry(inquiryId);
        setInquiry(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (inquiryId) fetchData();
  }, [inquiryId]);

  const handleReply = async () => {
    if (!message.trim()) return;
    setReplying(true);
    try {
      const updated = await salesService.replyInquiry(
        inquiryId,
        message.trim(),
      );
      setInquiry(updated);
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setReplying(false);
    }
  };

  if (loading) {
    return (
      <SalesLayout>
        <div className="bg-white rounded-lg shadow p-6">Đang tải...</div>
      </SalesLayout>
    );
  }

  if (!inquiry) {
    return (
      <SalesLayout>
        <div className="bg-white rounded-lg shadow p-6">
          Không tìm thấy yêu cầu.
        </div>
      </SalesLayout>
    );
  }

  return (
    <SalesLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {inquiry.subject}
          </h1>
          <p className="text-gray-600">Đơn #{inquiry.orderId.split("-")[0]}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Trao đổi</h2>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
            {inquiry.messages.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có trao đổi.</p>
            ) : (
              inquiry.messages.map((m) => (
                <div key={m.id} className="border rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {m.senderName || m.senderRole}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{m.senderRole}</p>
                  <p className="text-sm text-gray-800 whitespace-pre-line">
                    {m.content}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2 pt-2 border-t">
            <label className="text-sm text-gray-600">Trả lời khách hàng</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={3}
            />
            <button
              onClick={handleReply}
              disabled={replying}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {replying ? "Đang gửi..." : "Gửi trả lời"}
            </button>
          </div>
        </div>
      </div>
    </SalesLayout>
  );
}
