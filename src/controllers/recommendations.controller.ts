// CONTROLLER — Recomendaciones (lectura).
import { RecommendationModel } from "@/models/recommendation.model";

export const RecommendationsController = {
  async loadAll() {
    return RecommendationModel.listAll();
  },
};
