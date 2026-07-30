export interface OverlayConnectionSummary {
  total: number;
  uniqueOverlays: number;
}

export class OverlayConnectionTracker {
  private readonly connectionsByToken = new Map<string, number>();
  private total = 0;

  connect(publicToken: string): () => void {
    this.total += 1;
    this.connectionsByToken.set(
      publicToken,
      (this.connectionsByToken.get(publicToken) ?? 0) + 1
    );
    let connected = true;

    return () => {
      if (!connected) {
        return;
      }
      connected = false;
      this.total -= 1;

      const remaining = (this.connectionsByToken.get(publicToken) ?? 1) - 1;
      if (remaining > 0) {
        this.connectionsByToken.set(publicToken, remaining);
      } else {
        this.connectionsByToken.delete(publicToken);
      }
    };
  }

  getSummary(): OverlayConnectionSummary {
    return {
      total: this.total,
      uniqueOverlays: this.connectionsByToken.size
    };
  }
}

export const overlayConnectionTracker = new OverlayConnectionTracker();
