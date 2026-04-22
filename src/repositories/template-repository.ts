import { createId } from "@/lib/utils/id";
import { paginate } from "@/lib/utils/pagination";
import type { AppDataSnapshot, TemplateRecord } from "@/types/domain";

export interface TemplateInput {
  name: string;
  language: string;
  channel: TemplateRecord["channel"];
  subjectTemplate: string;
  bodyTemplate: string;
  active: boolean;
}

export class TemplateRepository {
  constructor(private readonly state: AppDataSnapshot) {}

  list(params?: { page?: number; pageSize?: number; active?: boolean }) {
    const items = [...this.state.templates]
      .filter((template) => (params?.active === undefined ? true : template.active === params.active))
      .sort((a, b) => a.name.localeCompare(b.name));

    return paginate(items, params?.page, params?.pageSize ?? 10);
  }

  getAll() {
    return [...this.state.templates];
  }

  findById(id: string) {
    return this.state.templates.find((template) => template.id === id) ?? null;
  }

  create(input: TemplateInput) {
    const template: TemplateRecord = {
      id: createId("template"),
      ...input,
    };
    this.state.templates.unshift(template);
    return template;
  }

  update(id: string, input: Partial<TemplateInput>) {
    const index = this.state.templates.findIndex((template) => template.id === id);
    if (index < 0) {
      return null;
    }

    const updated = { ...this.state.templates[index], ...input };
    this.state.templates[index] = updated;
    return updated;
  }
}
