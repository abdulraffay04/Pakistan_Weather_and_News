const leftNewsDiv = document.getElementById("leftNews");
const rightNewsDiv = document.getElementById("rightNews");

async function getNews() {
  const rssUrl = encodeURIComponent("https://www.geo.tv/rss/1/1"); // Geo News RSS
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const articles = data.items;
    const leftArticles = articles.slice(0, Math.ceil(articles.length / 2));
    const rightArticles = articles.slice(Math.ceil(articles.length / 2));

    leftNewsDiv.innerHTML = "<h2>Latest News</h2>";
    rightNewsDiv.innerHTML = "<h2>More News</h2>";

    function extractImage(content) {
      const imgMatch = content.match(/<img.*?src="(.*?)"/);
      return imgMatch ? imgMatch[1] : null;
    }

    function createNewsCard(article) {
      const imgUrl = extractImage(article.content);
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        ${imgUrl ? `<img src="${imgUrl}" alt="News Image">` : ""}
        <h4>${article.title}</h4>
        <p>${article.pubDate.split(" ")[0]}</p>
      `;
      return card;
    }

    leftArticles.forEach(article => leftNewsDiv.appendChild(createNewsCard(article)));
    rightArticles.forEach(article => rightNewsDiv.appendChild(createNewsCard(article)));

  } catch (err) {
    leftNewsDiv.innerHTML = "❌ Error loading news";
    rightNewsDiv.innerHTML = "❌ Error loading news";
    console.error(err);
  }
}

getNews();
