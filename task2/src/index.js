document.addEventListener('DOMContentLoaded', ()=>{

    const articleList = document.querySelector('#section-news');
    let articles = [];
    let notificationGranted = false;
    let notification;
    let interval;
    let newArticle = false;
    getRecentArticles();
    setupNotification();

    //polling
    interval = setInterval(()=>{
        generateNewArticle();
        newArticle = true;
        getRecentArticles()
    }, 10000);
    async function getRecentArticles(){
        const response = await fetch('http://localhost:3000/api/news', {
            method: 'GET',
        });
        const data = await response.json();
        articles = data.items;
        for(let a of articles){
            articleList.innerHTML += `
                <article>
                      <img src="${a.imageUrl}" alt="image of ${a.title}">
                      <div>
                            <strong>${a.title}</strong>
                            <small>${a.publicationDate}, ${a.author}</small>
                       </div>
                </article>
            `;
        }
    }
    async function generateNewArticle(){
        const response = await fetch('http://localhost:3000/api/news/publish', {
            method: 'POST',
        });
    }
    async function setupNotification(){
        const perm = await Notification.requestPermission();//we need to request permission for notification first
        if(perm === "granted"){
            notificationGranted = true;
        }
    }

    let isAway = false;
    let notificationInterval = null;
    //when the app is not visible
    document.addEventListener("visibilitychange", ()=>{
       if(document.visibilityState === "hidden"){
           isAway = true;
           //when the app is hidden
           //check for new article
           notificationInterval = setInterval(()=>{
               if(newArticle){
                   notification = new Notification(articles[articles.length - 1].title, {
                       icon: './icon/ai-news.png'
                   })
               }
           } , 10000);

       }else{
           //when user back to app remove the notification
           if(notification) notification.close();
           newArticle = false;
           clearInterval(notificationInterval);
       }
    });
    //register the service worker
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("sw.js").then((registration) => {
            console.log("Service worker registration successful", registration);
        },(error) => {
            console.error(`Service worker registration failed: ${error}`);
        })
    }else{
        console.error("Service workers are not supported");
    }
});