// Function to generate bookmark CSV and download it
function generateBookmarkCSV(callback) {
    const rows = [["ID", "Title", "URL", "Parent ID", "Date Added", "Index"]]; // CSV header

    chrome.bookmarks.getTree((nodes) => {
        processNodes(nodes, rows);
        const csvContent = rows.map((row) => row.join(",")).join("\n"); // Convert to CSV format
        callback(csvContent);
    });
}

// Recursively process bookmarks and folders
function processNodes(nodes, rows) {
    nodes.forEach((node) => {
        if (node.url || node.children) {
            rows.push([
                node.id,
                `"${node.title || ""}"`,
                node.url || "",
                node.parentId || "",
                node.dateAdded ? new Date(node.dateAdded).toLocaleString() : "",
                node.index || "",
            ]);

            if (node.children) {
                processNodes(node.children, rows);
            }
        }
    });
}

// Listener for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "exportBookmarks") {
        generateBookmarkCSV((csvContent) => {
            // Create a data URL for the CSV content
            const csvData = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);

            // Use the downloads API to save the file
            chrome.downloads.download(
                {
                    url: csvData,
                    filename: "bookmarks.csv",
                    saveAs: true,
                },
                () => {
                    console.log("Download initiated!");
                    sendResponse({ success: true });
                }
            );
        });

        return true; // Keep the message channel open for async response
    }
});