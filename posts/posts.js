(() => {
    "use strict";

    const listEl = document.getElementById("posts-list");
    const viewer = document.getElementById("post-viewer");

    const FALLBACK_POSTS = [
        { file: "hello-terminal.md", title: "Hello Terminal" },
        { file: "writing-in-markdown.md", title: "Writing in Markdown" }
    ];

    let currentPosts = [...FALLBACK_POSTS];

    if (!listEl || !viewer) {
        return;
    }

    function renderMarkdown(text) {
        viewer.textContent = "";
        viewer.classList.add("markdown");
        if (window.MarkdownRenderer && typeof window.MarkdownRenderer.renderInto === "function") {
            window.MarkdownRenderer.renderInto(viewer, text);
        } else {
            viewer.textContent = text;
        }
    }

    function setActiveButton(activeButton) {
        const buttons = listEl.querySelectorAll("button.post-link");
        buttons.forEach((button) => {
            if (button === activeButton) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    }

    function loadPost(file, button) {
        fetch(file)
            .then((response) => (response.ok ? response.text() : Promise.reject(new Error("missing"))))
            .then((content) => {
                renderMarkdown(content);
                if (button) {
                    setActiveButton(button);
                }
                window.location.hash = encodeURIComponent(file);
            })
            .catch(() => {
                renderMarkdown("# Missing post\n\nThe selected post could not be loaded.");
            });
    }

    function renderList(posts) {
        listEl.textContent = "";

        if (!posts.length) {
            const empty = document.createElement("div");
            empty.className = "posts-empty";
            empty.textContent = "No posts yet.";
            listEl.appendChild(empty);
            renderMarkdown("# Posts\n\nNo posts found in this folder.");
            return;
        }

        posts.forEach((post, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "post-link";
            button.textContent = post.title || post.file;
            button.addEventListener("click", () => loadPost(post.file, button));
            listEl.appendChild(button);

            if (index === 0) {
                loadPost(post.file, button);
            }
        });
    }

    function loadFromHash() {
        const raw = window.location.hash.replace(/^#/, "");
        if (!raw) {
            return false;
        }
        const decoded = decodeURIComponent(raw);
        const match = currentPosts.find((post) => post.file === decoded);
        if (!match) {
            return false;
        }
        const button = Array.from(listEl.querySelectorAll("button.post-link"))
            .find((btn) => btn.textContent === (match.title || match.file));
        loadPost(match.file, button || null);
        return true;
    }

    fetch("posts.json")
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error("missing"))))
        .then((data) => Array.isArray(data) ? data : [])
        .then((posts) => {
            const normalized = posts
                .filter((post) => post && typeof post.file === "string")
                .map((post) => ({
                    file: post.file,
                    title: typeof post.title === "string" ? post.title : post.file
                }));
            currentPosts = normalized.length ? normalized : [...FALLBACK_POSTS];
            renderList(currentPosts);
            loadFromHash();
        })
        .catch(() => {
            currentPosts = [...FALLBACK_POSTS];
            renderList(currentPosts);
            loadFromHash();
        });

    window.addEventListener("hashchange", () => {
        loadFromHash();
    });
})();
