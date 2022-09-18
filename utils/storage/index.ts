interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface Storage {
  saveTokens: (tokens: Tokens) => void;
  loadTokens: () => Tokens;
  clean: () => void;
}

const storage: Storage = {
  saveTokens: ({ accessToken, refreshToken }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  loadTokens: () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) {
      throw new Error("Failed to load tokens");
    }
    return { accessToken, refreshToken };
  },
  clean: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

export default storage;
