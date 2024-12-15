const table = new Tabulator("#task-table", {
    columns: [
        { title: "Task ID", field: "id", width: 70, editor: false},
        { title: "Title", field: "title", editor: "input"},
        { title: "Description", field: "description", editor: "input"},
        {
            title: "Status",
            field: "status",
            editor: "select",
            editorParams: { values: ["To Do", "In Progress", "Done"] },
        },
        {
            title: "Actions",
            formatter: "buttonCross",
            width: 100,
            align: "center",
            cellClick: function (e, cell) {
                cell.getRow().delete();
                updateCounters();
            },
        },
    ],
    height: "400px",
    layout: "fitColumns",
    placeholder: "No Task Available",
});


fetch("https://jsonplaceholder.typicode.com/todos")
.then((response) => response.json())
.then((data) => {
    const tasks = data.slice(0, 20).map((task) => ({
        id: task.id,
        title: task.title,
        description: "N/A",
        status: task.completed ? "Done" : "To Do",
    }));
    table.setData(tasks);
    updateCounters();
});


document.getElementById("task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("title").value;
    const status = document.getElementById("title").value;

    table.addRow({id: Date.now(), title, description, status });
    e.target.reset();
    updateCounters();
});

document.getElementById("status-filter").addEventListener("change", (e) => {
    const filterValue = e.target.value;
    table.setFilter("status", "=", filterValue || null);
});


document.getElementById("search").addEventListener("input", (e) => {
    const value= e.target.value.toLowerCase();
    table.setFilter([
        {field: "title", type: "like", value},
        {field: "description", type: "like", value},
    ]);
});


const updateCounters = () => {
    const data = table.getData();
    document.getElementById("todo-count").textContent = data.filter(
        (task) => task.status === "To Do"
    ).length;
    document.getElementById("in-progress-count").textContent = data.filter(
        (task) => task.status === "In Progress"
    ).length;
    document.getElementById("done-count").textContent = data.filter(
        (task) => task.status === "Done"
    ).length;
};