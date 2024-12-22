// document.getElementById("exportButton").addEventListener("click", () => {
//     chrome.runtime.sendMessage({ action: "exportBookmarks" }, (response) => {
//         if (response.success) {
//             alert("Bookmarks exported successfully!");
//         }
//     });
// });

document.getElementById("exportButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "exportBookmarks" }, (response) => {
        if (response && response.success) {
            alert("Bookmarks exported successfully!");
        } else {
            alert("Failed to export bookmarks.");
        }
    });
});

