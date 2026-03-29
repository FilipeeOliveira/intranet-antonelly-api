// Evita erro de módulo nativo bcrypt fora do ambiente Docker
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed"),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue("salt"),
}));

import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { MeetingService } from "./meeting.service";
import { MeetingRepository } from "../../infrastructure/repositories/meeting.repository";
import { MeetingStatus } from "../../domain/enums/MeetingStatus";
import { RoomsService } from "src/modules/rooms/application/services/rooms.service";
import moment from "moment";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeMeeting(overrides: Partial<any> = {}): any {
  return {
    id: "meeting-1",
    subject: "Reunião de Teste",
    description: null,
    sector: "TI",
    responsible: "Filipe Oliveira",
    date: new Date("2026-03-27T00:00:00.000Z"),
    startTime: "10:00",
    endTime: "14:00",
    status: MeetingStatus.SCHEDULED,
    roomId: "room-1",
    actualStartAt: null,
    actualEndAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    Room: { id: "room-1", name: "Sala A" },
    ...overrides,
  };
}

// "now" fixo: 2026-03-27 12:00 — dentro da janela 10:00–14:00
const FIXED_NOW = moment("2026-03-27T12:00:00").utc(true);

// ─── Suite ──────────────────────────────────────────────────────────────────

describe("MeetingService", () => {
  let service: MeetingService;
  let repo: jest.Mocked<MeetingRepository>;

  beforeEach(async () => {
    const mockRepo = {
      findById: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findConflict: jest.fn(),
      findToday: jest.fn(),
      findInProgressPastEndTime: jest.fn(),
      findScheduledPastEndTime: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingService,
        { provide: MeetingRepository, useValue: mockRepo },
        { provide: RoomsService, useValue: { findById: jest.fn() } },
      ],
    }).compile();

    service = module.get<MeetingService>(MeetingService);
    repo = module.get(MeetingRepository);

    // Controla o "agora" para um ponto fixo — evita flakiness dependente de horário real
    jest.spyOn(service as any, "getNow").mockReturnValue(FIXED_NOW.clone());
  });

  afterEach(() => jest.clearAllMocks());

  // ─── start() ──────────────────────────────────────────────────────────────

  describe("start()", () => {
    it("inicia com sucesso quando está dentro da janela", async () => {
      // FIXED_NOW = 12:00; janela = 10:00–14:00 → válido
      const meeting = makeMeeting();
      repo.findById.mockResolvedValue(meeting);
      repo.update.mockResolvedValue({ ...meeting, status: MeetingStatus.IN_PROGRESS });

      await service.start("meeting-1");

      expect(repo.update).toHaveBeenCalledWith(
        "meeting-1",
        expect.objectContaining({
          status: MeetingStatus.IN_PROGRESS,
          actualStartAt: expect.any(Date),
        }),
      );
    });

    it("não altera startTime nem endTime ao iniciar", async () => {
      const meeting = makeMeeting();
      repo.findById.mockResolvedValue(meeting);
      repo.update.mockResolvedValue({} as any);

      await service.start("meeting-1");

      const payload = repo.update.mock.calls[0][1];
      expect(payload.startTime).toBeUndefined();
      expect(payload.endTime).toBeUndefined();
    });

    it("lança erro se status não for SCHEDULED", async () => {
      repo.findById.mockResolvedValue(makeMeeting({ status: MeetingStatus.IN_PROGRESS }));
      await expect(service.start("meeting-1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro se a reunião for de outro dia", async () => {
      const yesterday = new Date("2026-03-26T00:00:00.000Z");
      repo.findById.mockResolvedValue(makeMeeting({ date: yesterday }));
      await expect(service.start("meeting-1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro se horário atual for antes do startTime", async () => {
      // FIXED_NOW = 12:00; janela = 13:00–15:00 → cedo demais
      repo.findById.mockResolvedValue(makeMeeting({ startTime: "13:00", endTime: "15:00" }));
      await expect(service.start("meeting-1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro se horário atual for igual ou após o endTime", async () => {
      // FIXED_NOW = 12:00; endTime = 12:00 → janela encerrada
      repo.findById.mockResolvedValue(makeMeeting({ startTime: "10:00", endTime: "12:00" }));
      await expect(service.start("meeting-1")).rejects.toThrow(BadRequestException);
    });

    it("lança NotFoundException se a reunião não existir", async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.start("inexistente")).rejects.toThrow(NotFoundException);
    });
  });

  // ─── finish() ─────────────────────────────────────────────────────────────

  describe("finish()", () => {
    it("finaliza com sucesso quando está IN_PROGRESS", async () => {
      const meeting = makeMeeting({ status: MeetingStatus.IN_PROGRESS });
      repo.findById.mockResolvedValue(meeting);
      repo.update.mockResolvedValue({ ...meeting, status: MeetingStatus.COMPLETED });

      await service.finish("meeting-1");

      expect(repo.update).toHaveBeenCalledWith(
        "meeting-1",
        expect.objectContaining({
          status: MeetingStatus.COMPLETED,
          actualEndAt: expect.any(Date),
        }),
      );
    });

    it("não altera endTime ao finalizar", async () => {
      repo.findById.mockResolvedValue(makeMeeting({ status: MeetingStatus.IN_PROGRESS, endTime: "14:00" }));
      repo.update.mockResolvedValue({} as any);

      await service.finish("meeting-1");

      const payload = repo.update.mock.calls[0][1];
      expect(payload.endTime).toBeUndefined();
    });

    it("lança erro se status não for IN_PROGRESS", async () => {
      repo.findById.mockResolvedValue(makeMeeting({ status: MeetingStatus.SCHEDULED }));
      await expect(service.finish("meeting-1")).rejects.toThrow(BadRequestException);
    });

    it("lança NotFoundException se a reunião não existir", async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.finish("inexistente")).rejects.toThrow(NotFoundException);
    });
  });

  // ─── delete() — cancelamento lógico ───────────────────────────────────────

  describe("delete()", () => {
    it("cancela com sucesso quando está SCHEDULED", async () => {
      repo.findById.mockResolvedValue(makeMeeting({ status: MeetingStatus.SCHEDULED }));
      repo.cancel.mockResolvedValue({ status: MeetingStatus.CANCELED } as any);

      await service.delete("meeting-1");

      expect(repo.cancel).toHaveBeenCalledWith("meeting-1");
    });

    it("não chama delete físico — usa cancel", async () => {
      repo.findById.mockResolvedValue(makeMeeting({ status: MeetingStatus.SCHEDULED }));
      repo.cancel.mockResolvedValue({} as any);

      await service.delete("meeting-1");

      // Confirma que o método de exclusão física não existe / não foi chamado
      expect((repo as any).delete).toBeUndefined();
    });

    it("lança erro se estiver IN_PROGRESS", async () => {
      repo.findById.mockResolvedValue(makeMeeting({ status: MeetingStatus.IN_PROGRESS }));
      await expect(service.delete("meeting-1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro se estiver COMPLETED", async () => {
      repo.findById.mockResolvedValue(makeMeeting({ status: MeetingStatus.COMPLETED }));
      await expect(service.delete("meeting-1")).rejects.toThrow(BadRequestException);
    });

    it("lança erro se já estiver CANCELED", async () => {
      repo.findById.mockResolvedValue(makeMeeting({ status: MeetingStatus.CANCELED }));
      await expect(service.delete("meeting-1")).rejects.toThrow(BadRequestException);
    });

    it("lança NotFoundException se a reunião não existir", async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.delete("inexistente")).rejects.toThrow(NotFoundException);
    });
  });

  // ─── updateMeetingsStatus() — cron ────────────────────────────────────────

  describe("updateMeetingsStatus()", () => {
    const cronDate = new Date("2026-03-27T12:00:00.000Z");

    it("finaliza reunião IN_PROGRESS que ultrapassou o endTime (preenche actualEndAt)", async () => {
      const meeting = makeMeeting({
        status: MeetingStatus.IN_PROGRESS,
        startTime: "08:00",
        endTime: "10:00",
        actualStartAt: new Date(),
        actualEndAt: null,
      });
      repo.findInProgressPastEndTime.mockResolvedValue([meeting]);
      repo.findScheduledPastEndTime.mockResolvedValue([]);
      repo.update.mockResolvedValue({} as any);

      await service.updateMeetingsStatus(cronDate);

      expect(repo.update).toHaveBeenCalledWith(
        "meeting-1",
        expect.objectContaining({
          status: MeetingStatus.COMPLETED,
          actualEndAt: expect.any(Date),
        }),
      );
    });

    it("preserva actualEndAt existente se já estiver preenchido", async () => {
      const existingEndAt = new Date("2026-03-27T10:05:00.000Z");
      const meeting = makeMeeting({
        status: MeetingStatus.IN_PROGRESS,
        endTime: "10:00",
        actualEndAt: existingEndAt,
      });
      repo.findInProgressPastEndTime.mockResolvedValue([meeting]);
      repo.findScheduledPastEndTime.mockResolvedValue([]);
      repo.update.mockResolvedValue({} as any);

      await service.updateMeetingsStatus(cronDate);

      const payload = repo.update.mock.calls[0][1];
      expect(payload.actualEndAt).toBe(existingEndAt);
    });

    it("move reunião SCHEDULED vencida para COMPLETED sem preencher actualStartAt/actualEndAt", async () => {
      const meeting = makeMeeting({ status: MeetingStatus.SCHEDULED, endTime: "09:00" });
      repo.findInProgressPastEndTime.mockResolvedValue([]);
      repo.findScheduledPastEndTime.mockResolvedValue([meeting]);
      repo.update.mockResolvedValue({} as any);

      await service.updateMeetingsStatus(cronDate);

      expect(repo.update).toHaveBeenCalledWith(
        "meeting-1",
        expect.objectContaining({ status: MeetingStatus.COMPLETED }),
      );
      const payload = repo.update.mock.calls[0][1];
      expect(payload.actualStartAt).toBeUndefined();
      expect(payload.actualEndAt).toBeUndefined();
    });

    it("não inicia nenhuma reunião automaticamente (SCHEDULED → IN_PROGRESS)", async () => {
      repo.findInProgressPastEndTime.mockResolvedValue([]);
      repo.findScheduledPastEndTime.mockResolvedValue([]);

      await service.updateMeetingsStatus(cronDate);

      const allCalls = repo.update.mock.calls;
      const autoStartCalls = allCalls.filter(([, data]) => data.status === MeetingStatus.IN_PROGRESS);
      expect(autoStartCalls).toHaveLength(0);
    });

    it("não faz nada se não houver reuniões vencidas", async () => {
      repo.findInProgressPastEndTime.mockResolvedValue([]);
      repo.findScheduledPastEndTime.mockResolvedValue([]);

      await service.updateMeetingsStatus(cronDate);

      expect(repo.update).not.toHaveBeenCalled();
    });
  });
});
