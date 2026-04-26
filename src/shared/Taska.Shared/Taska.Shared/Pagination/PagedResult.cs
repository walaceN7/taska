namespace Taska.Shared.Pagination;

public class PagedResult<T>(List<T> items, int totalCount, int pageNumber, int pageSize)
{
    public List<T> Items { get; set; } = items;
    public int TotalCount { get; set; } = totalCount;
    public int PageNumber { get; set; } = pageNumber;
    public int PageSize { get; set; } = pageSize;
    public int TotalPages { get; set; } = (int)Math.Ceiling(totalCount / (double)pageSize);
    public bool HasNextPage => PageNumber < TotalPages;
    public bool HasPreviousPage => PageNumber > 1;
}