 const API_URL = "http://127.0.0.1:8000";


const form = document.getElementById("requestForm");

const message = document.getElementById("message");

const requestTable =
    document.getElementById("requestTable");


const totalRequests =
    document.getElementById("totalRequests");

const criticalRequests =
    document.getElementById("criticalRequests");

const highRequests =
    document.getElementById("highRequests");

const openRequests =
    document.getElementById("openRequests");


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const requestData = {

        title:
            document.getElementById("title").value,

        description:
            document.getElementById("description").value,

        category:
            document.getElementById("category").value,

        requester:
            document.getElementById("requester").value

    };


    try {

        const response = await fetch(
            `${API_URL}/requests`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestData)
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail || "Request failed"
            );

        }


        message.textContent =
            `Request #${data.request_id} created. ` +
            `Priority: ${data.priority}`;


        form.reset();


        await loadRequests();

    }

    catch (error) {

        message.textContent =
            `Error: ${error.message}`;

    }

});


async function loadRequests() {

    try {

        const response =
            await fetch(`${API_URL}/requests`);


        const requests =
            await response.json();


        updateStatistics(requests);


        const priorityFilter =
            document.getElementById(
                "priorityFilter"
            ).value;


        const statusFilter =
            document.getElementById(
                "statusFilter"
            ).value;


        const filteredRequests =
            requests.filter(request => {

                const priorityMatches =
                    priorityFilter === "ALL" ||
                    request.priority === priorityFilter;


                const statusMatches =
                    statusFilter === "ALL" ||
                    request.status === statusFilter;


                return (
                    priorityMatches &&
                    statusMatches
                );

            });


        displayRequests(filteredRequests);

    }

    catch (error) {

        requestTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to connect to CloudServe API.
                </td>
            </tr>
        `;

    }

}


function updateStatistics(requests) {

    totalRequests.textContent =
        requests.length;


    criticalRequests.textContent =
        requests.filter(
            request =>
                request.priority === "CRITICAL"
        ).length;


    highRequests.textContent =
        requests.filter(
            request =>
                request.priority === "HIGH"
        ).length;


    openRequests.textContent =
        requests.filter(
            request =>
                request.status === "OPEN"
        ).length;

}


 function displayRequests(requests) {

    requestTable.innerHTML = "";


    if (requests.length === 0) {

        requestTable.innerHTML = `
            <tr>
                <td colspan="7">
                    No matching requests found.
                </td>
            </tr>
        `;

        return;
    }


    requests.forEach(request => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${request.id}
            </td>

            <td>
                ${request.title}
            </td>

            <td>
                ${request.category}
            </td>

            <td>
                <select
                    id="priority-${request.id}"
                >

                    <option value="LOW"
                        ${request.priority === "LOW" ? "selected" : ""}>
                        LOW
                    </option>

                    <option value="HIGH"
                        ${request.priority === "HIGH" ? "selected" : ""}>
                        HIGH
                    </option>

                    <option value="CRITICAL"
                        ${request.priority === "CRITICAL" ? "selected" : ""}>
                        CRITICAL
                    </option>

                </select>
            </td>

            <td>
                <select
                    id="status-${request.id}"
                >

                    <option value="OPEN"
                        ${request.status === "OPEN" ? "selected" : ""}>
                        OPEN
                    </option>

                    <option value="ASSIGNED"
                        ${request.status === "ASSIGNED" ? "selected" : ""}>
                        ASSIGNED
                    </option>

                    <option value="IN_PROGRESS"
                        ${request.status === "IN_PROGRESS" ? "selected" : ""}>
                        IN PROGRESS
                    </option>

                    <option value="RESOLVED"
                        ${request.status === "RESOLVED" ? "selected" : ""}>
                        RESOLVED
                    </option>

                    <option value="CLOSED"
                        ${request.status === "CLOSED" ? "selected" : ""}>
                        CLOSED
                    </option>

                </select>
            </td>

            <td>

                <select
                    id="team-${request.id}"
                >

                    <option value="">
                        Unassigned
                    </option>

                    <option value="Network Support"
                        ${request.assigned_team === "Network Support" ? "selected" : ""}>
                        Network Support
                    </option>

                    <option value="Software Support"
                        ${request.assigned_team === "Software Support" ? "selected" : ""}>
                        Software Support
                    </option>

                    <option value="Security Team"
                        ${request.assigned_team === "Security Team" ? "selected" : ""}>
                        Security Team
                    </option>

                    <option value="Infrastructure Team"
                        ${request.assigned_team === "Infrastructure Team" ? "selected" : ""}>
                        Infrastructure Team
                    </option>

                </select>

            </td>

            <td>

                <button
                    class="update-button"
                    onclick="updateRequest(${request.id})"
                >
                    Update
                </button>

            </td>

        `;


        requestTable.appendChild(row);

    });

}

loadRequests();