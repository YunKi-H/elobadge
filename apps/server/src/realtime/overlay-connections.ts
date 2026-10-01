export interface OverlayConnectionSummary {
  total: number;
  uniqueOverlays: number;
}

export class OverlayConnectionTracker {
  private readonly connectionsByToken = new Map<string, number>();
  private readonly connectionsByStreamer = new Map<string, number>();
  private total = 0;

  connect(publicToken: string, streamerUid?: string): () => void {
    if (streamerUid) {
      this.connectionsByStreamer.set(streamerUid, this.getStreamerConnectionCount(streamerUid) + 1);
    }
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
      if (streamerUid) {
        const count = this.getStreamerConnectionCount(streamerUid) - 1;
        if (count > 0) this.connectionsByStreamer.set(streamerUid, count);
        else this.connectionsByStreamer.delete(streamerUid);
      }

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

  getStreamerConnectionCount(uid: string): number {
    return this.connectionsByStreamer.get(uid) ?? 0;
  }
}

export const overlayConnectionTracker = new OverlayConnectionTracker();
