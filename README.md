# Bridge of Hope

Crie o MVP de uma aplicação web PWA global chamada "Programa Refugiados UNESCO", voltada à conexão segura entre pessoas refugiadas e psicólogos voluntários.

OBJETIVO:
- Psicólogos voluntários se cadastram e passam por verificação profissional, incluindo CFP/Conselho Regional de Psicologia, dados de identidade e segurança.
- O psicólogo responde questionário de especialidades, idiomas, experiência, populações atendidas, disponibilidade e interesses de formação.
- Perfil público profissional com bio, especialidades, idiomas, localização/região ampla e disponibilidade, sem expor dados pessoais sensíveis.
- Refugiados podem pesquisar, filtrar e escolher psicólogos por especialidade, idioma, disponibilidade e outros critérios seguros.
- Psicólogos têm agenda de atendimentos e integração para sessões por Google Meet.
- Criar modelo de parceria com universidades: psicólogos podem indicar interesse em especializações/pós-graduações; universidades/parceiros podem oferecer bolsas ou subsídios de até 15%, conforme regras do programa.
- Sistema público de ranking de maiores ajudantes, com gamificação e pontos. Pontos podem futuramente contribuir para elegibilidade a bolsas, mas nunca devem substituir critérios acadêmicos/profissionais nem revelar dados clínicos.
- Botão de suporte emergencial claramente visível, com fluxo de encaminhamento apropriado. Não prometer atendimento emergencial pela plataforma.
- Aplicação global, multilíngue desde a arquitetura (começar em português e inglês).
- IA para triagem inicial, apoio à avaliação/regulação do fórum e compreensão preliminar do estado mental. A IA NÃO deve diagnosticar, substituir psicólogo ou tomar decisões clínicas autônomas.
- Pós-atendimento: IA pode ajudar o psicólogo a estruturar um resumo/arquivo clínico, sempre com revisão humana e controles de acesso.

ARQUITETURA E PRIVACIDADE:
- Supabase será usado para autenticação, perfis, disponibilidade, agenda, matching, pontuação, ranking, universidades/parcerias e metadados operacionais.
- NÃO armazenar prontuários clínicos completos, gravações de sessões, transcrições sensíveis ou arquivos clínicos diretamente em tabelas públicas do Supabase no MVP.
- Preparar arquitetura para armazenamento externo seguro (ex.: Google Cloud/Google Drive empresarial ou outro storage compatível), com referências/IDs e controle de acesso.
- Aplicar LGPD/privacy-by-design: mínimo necessário, RLS, separação de papéis, auditoria e consentimento.
- Papéis: refugee/patient, psychologist, university_partner, moderator/support, admin.
- Verificação do psicólogo deve ter status pending/verified/rejected e dados do CFP protegidos; não expor documentos pessoais.
- Nunca colocar chaves secretas no frontend.

TELAS MVP:
1. Landing/home pública explicando missão.
2. Cadastro/login.
3. Cadastro do psicólogo em etapas.
4. Verificação profissional/segurança.
5. Perfil do psicólogo.
6. Busca/matching de psicólogos para refugiados.
7. Dashboard do psicólogo.
8. Agenda e sessões.
9. Dashboard do refugiado.
10. Gamificação, pontos e ranking.
11. Universidades/parcerias e oportunidades de bolsa.
12. Central de suporte/emergência.
13. Área administrativa/moderação.
14. Configurações, consentimento e privacidade.

DESIGN:
- Visual profissional, institucional, humano e acolhedor; aparência de plataforma internacional de impacto social, sem parecer aplicativo infantil.
- Responsivo mobile-first, acessível, PWA instalável.
- Interface limpa, moderna e multilíngue.
- Criar dados fictícios/demonstração para permitir visualizar o MVP.

BANCO:
- Preparar a aplicação para Supabase, mas não inventar credenciais.
- Criar tipos/interfaces e camada de acesso organizada para receber o projeto Supabase depois.
- Modelar entidades: profiles, psychologist_profiles, psychologist_verifications, specialties, psychologist_specialties, languages, psychologist_languages, refugee_profiles, availability, appointments, universities, scholarship_opportunities, psychologist_interests, points_ledger, leaderboard, support_requests, consents, audit_events.
- RLS deve ser considerado desde o início.

IMPORTANTE:
- Este é um MVP inicial. Priorize arquitetura correta, segurança e fluxos essenciais em vez de implementar uma IA clínica real agora.
- Use placeholders/mock para integrações externas (Google Meet, Google Cloud/Drive e IA), deixando interfaces preparadas.
- Não afirmar que existe parceria oficial com UNESCO, universidades, CFP ou qualquer instituição até que isso seja efetivamente configurado.
- Nome do projeto: Programa Refugiados UNESCO (conceito/projeto, sem alegar afiliação oficial).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/664721b1-3038-4d90-b7f1-357e8e3894b0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
