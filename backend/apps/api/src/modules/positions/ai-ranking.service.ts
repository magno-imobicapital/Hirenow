import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/shared';
import { execFileSync } from 'child_process';
import { AiProvider } from './ai-provider';

@Injectable()
export class AiRankingService {
  private readonly logger = new Logger(AiRankingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiProvider: AiProvider,
  ) {}

  private extractPdfText(url: string): string {
    try {
      const scriptPath = require('path').join(
        process.cwd(),
        'apps/api/src/modules/positions/extract-pdf-text.js',
      );
      const result = execFileSync('node', [scriptPath, url], {
        encoding: 'utf-8',
        timeout: 30_000,
      });
      return result.trim();
    } catch (err) {
      this.logger.error(`PDF extraction failed: ${err}`);
      return '';
    }
  }

  async rankCandidates(positionId: string) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      select: {
        title: true,
        description: true,
        employmentType: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        currency: true,
      },
    });

    if (!position) return null;

    const applications = await this.prisma.application.findMany({
      where: {
        positionId,
        status: { notIn: ['WITHDRAWN', 'REJECTED'] },
      },
      select: {
        id: true,
        user: {
          select: {
            email: true,
            profile: {
              select: {
                fullName: true,
                about: true,
                salaryExpectation: true,
                resumeUrl: true,
              },
            },
          },
        },
      },
    });

    if (applications.length === 0) return [];

    this.logger.log(
      `Ranking solicitado: positionId=${positionId} candidatos=${applications.length}`,
    );

    const candidatesWithResume = applications.map((a, i) => {
      const p = a.user.profile;
      const resumeText = p?.resumeUrl
        ? this.extractPdfText(p.resumeUrl)
        : '';

      return `Candidato ${i + 1} (ID: ${a.id}):
- Nome: ${p?.fullName || a.user.email}
- Sobre: ${p?.about || 'Não informado'}
- Pretensão salarial: ${p?.salaryExpectation ? `R$ ${p.salaryExpectation}` : 'Não informada'}
- Conteúdo do currículo:
${resumeText ? resumeText.slice(0, 3000) : 'Currículo não disponível.'}`;
    });

    const candidatesText = candidatesWithResume.join('\n\n---\n\n');

    const systemPrompt = `Você é um recrutador sênior especialista em análise de currículos. Analise candidatos e retorne APENAS JSON válido, sem markdown, sem texto extra.`;

    const userPrompt = `Analise DETALHADAMENTE os candidatos abaixo para a vaga e ranqueie os 3 mais compatíveis.

CRITÉRIOS DE AVALIAÇÃO (em ordem de importância):
1. Experiência profissional relevante para a vaga (extraída do currículo)
2. Habilidades técnicas compatíveis com a descrição da vaga
3. Formação acadêmica relevante
4. Compatibilidade de pretensão salarial com a faixa oferecida
5. Aderência ao perfil geral (localização, regime de trabalho)

VAGA:
- Título: ${position.title}
- Descrição: ${position.description}
- Regime: ${position.employmentType}
- Local: ${position.location}
- Faixa salarial: ${position.currency} ${position.salaryMin} – ${position.salaryMax}

CANDIDATOS:
${candidatesText}

INSTRUÇÕES:
- Analise o currículo de cada candidato em profundidade.
- Compare as experiências e habilidades de cada um com os requisitos da vaga.
- Seja específico nas justificativas, citando experiências ou habilidades concretas do currículo.
- Se o candidato não tem currículo, penalize fortemente no ranking.
- Cada candidato deve aparecer NO MÁXIMO UMA VEZ. Nunca repita o mesmo applicationId.
- Se houver menos de 3 candidatos, retorne apenas os disponíveis.

Responda APENAS no formato JSON:
[{"applicationId": "...", "rank": 1, "reason": "..."}, {"applicationId": "...", "rank": 2, "reason": "..."}, {"applicationId": "...", "rank": 3, "reason": "..."}]`;

    try {
      const text = await this.aiProvider.chat(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.2, maxTokens: 4096 },
      );

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];
      const ranked: { applicationId: string; rank: number; reason: string }[] =
        JSON.parse(jsonMatch[0]);

      const validIds = new Set(applications.map((a) => a.id));
      const seen = new Set<string>();
      const result: {
        applicationId: string;
        rank: number;
        reason: string;
        candidateName: string;
        candidateEmail: string;
        hasResume: boolean;
      }[] = [];

      for (const r of ranked) {
        if (!validIds.has(r.applicationId)) continue;
        if (seen.has(r.applicationId)) continue;
        seen.add(r.applicationId);

        const app = applications.find((a) => a.id === r.applicationId);
        result.push({
          applicationId: r.applicationId,
          rank: result.length + 1,
          reason: r.reason,
          candidateName:
            app?.user.profile?.fullName || app?.user.email || 'Desconhecido',
          candidateEmail: app?.user.email || '',
          hasResume: Boolean(app?.user.profile?.resumeUrl),
        });

        if (result.length >= 3) break;
      }

      this.logger.log(
        `Ranking gerado: positionId=${positionId} resultados=${result.length}`,
      );

      return result;
    } catch (err) {
      this.logger.error(`Falha ao gerar ranking: ${err}`);
      return [];
    }
  }
}
