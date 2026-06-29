/**
 * API Service Client
 * Centralizes all network requests to the live backend server.
 * Operates dynamically by accepting the current backend URL configuration.
 */

export const api = {
  /**
   * Pings the server to verify health and get uptime details
   * @param {string} backendUrl 
   */
  async checkHealth(backendUrl) {
    const startTime = performance.now();
    const res = await fetch(`${backendUrl}/api/health`);
    const endTime = performance.now();
    
    if (!res.ok) {
      throw new Error(`Health check returned status: ${res.status}`);
    }
    
    const data = await res.json();
    return {
      ...data,
      latencyMs: Math.round(endTime - startTime)
    };
  },

  /**
   * Retrieves active modules and system metadata
   * @param {string} backendUrl 
   */
  async getStatus(backendUrl) {
    const res = await fetch(`${backendUrl}/api/status`);
    if (!res.ok) {
      throw new Error(`Status retrieval failed with status: ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Fetches the database inventory resource list
   * @param {string} backendUrl 
   */
  async getInventory(backendUrl) {
    const res = await fetch(`${backendUrl}/api/inventory`);
    if (!res.ok) {
      throw new Error(`Inventory list fetch failed: ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Inserts a new SKU asset into the system
   * @param {string} backendUrl 
   * @param {Object} itemPayload 
   */
  async addInventoryItem(backendUrl, itemPayload) {
    const res = await fetch(`${backendUrl}/api/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemPayload)
    });
    
    if (!res.ok) {
      throw new Error(`Failed to register new SKU item: ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Purges a SKU item from the live database
   * @param {string} backendUrl 
   * @param {string} id 
   */
  async deleteInventoryItem(backendUrl, id) {
    const res = await fetch(`${backendUrl}/api/inventory/${id}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      throw new Error(`Failed to delete SKU ID #${id}: ${res.status}`);
    }
    return await res.json();
  }
};
