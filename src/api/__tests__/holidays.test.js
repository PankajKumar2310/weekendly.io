
import { fetchIndianHolidays } from '../holidays';

// Mock fetch globally
global.fetch = jest.fn();

describe('fetchIndianHolidays', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches holidays successfully for a given year', async () => {
    const mockHolidays = [
      {
        name: 'Republic Day',
        date: '2024-01-26',
        type: 'national'
      },
      {
        name: 'Independence Day',
        date: '2024-08-15',
        type: 'national'
      }
    ];

    const mockResponse = {
      response: {
        holidays: mockHolidays
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchIndianHolidays(2024);

    expect(fetch).toHaveBeenCalledWith(
      'https://calendarific.com/api/v2/holidays?api_key=test-api-key&country=IN&year=2024&type=national'
    );
    expect(result).toEqual(mockHolidays);
  });

  it('returns empty array when no holidays are found', async () => {
    const mockResponse = {
      response: {
        holidays: []
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchIndianHolidays(2024);

    expect(result).toEqual([]);
  });

  it('returns empty array when holidays property is undefined', async () => {
    const mockResponse = {
      response: {}
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchIndianHolidays(2024);

    expect(result).toEqual([]);
  });

  it('throws error when API request fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchIndianHolidays(2024)).rejects.toThrow('Failed to fetch holidays');
  });

  it('throws error when network request fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchIndianHolidays(2024)).rejects.toThrow('Network error');
  });

  it('throws error when response is not ok (500 error)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchIndianHolidays(2024)).rejects.toThrow('Failed to fetch holidays');
  });

  it('throws error when response is not ok (401 error)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    await expect(fetchIndianHolidays(2024)).rejects.toThrow('Failed to fetch holidays');
  });

  it('constructs correct URL with different years', async () => {
    const mockResponse = {
      response: { holidays: [] }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchIndianHolidays(2023);
    expect(fetch).toHaveBeenCalledWith(
      'https://calendarific.com/api/v2/holidays?api_key=test-api-key&country=IN&year=2023&type=national'
    );

    await fetchIndianHolidays(2025);
    expect(fetch).toHaveBeenCalledWith(
      'https://calendarific.com/api/v2/holidays?api_key=test-api-key&country=IN&year=2025&type=national'
    );
  });

  it('handles different year types correctly', async () => {
    const mockResponse = {
      response: { holidays: [] }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // Test with string year
    await fetchIndianHolidays('2024');
    expect(fetch).toHaveBeenCalledWith(
      'https://calendarific.com/api/v2/holidays?api_key=test-api-key&country=IN&year=2024&type=national'
    );

    // Test with number year
    await fetchIndianHolidays(2024);
    expect(fetch).toHaveBeenCalledWith(
      'https://calendarific.com/api/v2/holidays?api_key=test-api-key&country=IN&year=2024&type=national'
    );
  });

  it('handles malformed JSON response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    await expect(fetchIndianHolidays(2024)).rejects.toThrow('Invalid JSON');
  });

  it('handles response with unexpected structure', async () => {
    const mockResponse = {
      // Missing 'response' property
      data: {
        holidays: []
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(fetchIndianHolidays(2024)).rejects.toThrow();
  });

  it('uses correct API key from environment', async () => {
    const mockResponse = {
      response: { holidays: [] }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchIndianHolidays(2024);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api_key=test-api-key')
    );
  });

  it('includes all required query parameters', async () => {
    const mockResponse = {
      response: { holidays: [] }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchIndianHolidays(2024);

    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toContain('api_key=test-api-key');
    expect(calledUrl).toContain('country=IN');
    expect(calledUrl).toContain('year=2024');
    expect(calledUrl).toContain('type=national');
  });

  it('handles large holiday datasets', async () => {
    const mockHolidays = Array.from({ length: 100 }, (_, i) => ({
      name: `Holiday ${i + 1}`,
      date: `2024-${String(i + 1).padStart(2, '0')}-01`,
      type: 'national'
    }));

    const mockResponse = {
      response: {
        holidays: mockHolidays
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchIndianHolidays(2024);

    expect(result).toHaveLength(100);
    expect(result[0].name).toBe('Holiday 1');
    expect(result[99].name).toBe('Holiday 100');
  });
});

