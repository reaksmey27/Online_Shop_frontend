import { ref } from "vue";
import { defineStore } from "pinia";
import api from "@/api/axios";

export const useStatsStore = defineStore("stats", () => {
  const athletes = ref(0);
  const products = ref(0);
  const rating = ref(0);
  const loading = ref(false);
  const error = ref(null);

  async function fetchStats() {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/stats");
      const d = response.data;
      // Support both { data: {...} } and flat response shapes
      const stats = d.data ?? d;

      athletes.value = stats.athletes ?? 0;
      products.value = stats.products ?? 0;
      rating.value   = stats.rating   ?? 0;
    } catch (err) {
      error.value = "Failed to load stats.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  return { athletes, products, rating, loading, error, fetchStats };
});
