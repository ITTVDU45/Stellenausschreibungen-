import { TemplateRepository, type TemplateInput } from "@/repositories/template-repository";

export interface TemplateVariables {
  company_name: string;
  job_title: string;
  location: string;
  contact_name: string;
  language: string;
  specialization: string;
}

export class TemplateService {
  constructor(private readonly templates: TemplateRepository) {}

  list(params?: { page?: number; pageSize?: number; active?: boolean }) {
    return this.templates.list(params);
  }

  getDetail(id: string) {
    const template = this.templates.findById(id);
    if (!template) {
      return null;
    }

    return {
      template,
      usageCount: 0,
    };
  }

  create(input: TemplateInput) {
    return this.templates.create(input);
  }

  update(id: string, input: Partial<TemplateInput>) {
    return this.templates.update(id, input);
  }

  render(templateId: string, variables: TemplateVariables) {
    const template = this.templates.findById(templateId);
    if (!template) {
      return null;
    }

    const replace = (value: string) =>
      value
        .replaceAll("{{company_name}}", variables.company_name)
        .replaceAll("{{job_title}}", variables.job_title)
        .replaceAll("{{location}}", variables.location)
        .replaceAll("{{contact_name}}", variables.contact_name)
        .replaceAll("{{language}}", variables.language)
        .replaceAll("{{specialization}}", variables.specialization);

    return {
      template,
      generatedSubject: replace(template.subjectTemplate),
      generatedBody: replace(template.bodyTemplate),
    };
  }
}
