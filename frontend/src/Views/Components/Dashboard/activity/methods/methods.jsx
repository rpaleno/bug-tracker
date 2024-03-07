//calculate elapsed time since activity creation
export function calculateTime(timeCreated) {
    const now = new Date();
    const createdAt = new Date(timeCreated);

    //convert both now and createdAt to UTC timestamps
    const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    const createdAtUTC = Date.UTC(createdAt.getUTCFullYear(), createdAt.getUTCMonth(), createdAt.getUTCDate(), createdAt.getUTCHours(), createdAt.getUTCMinutes(), createdAt.getUTCSeconds());

    const elapsedMilliseconds = nowUTC - createdAtUTC;
    const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    
    if (elapsedDays > 0 && elapsedDays <= 7) {
        return `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ago`;
    } else if (elapsedHours > 0) {
        return `${elapsedHours} ${elapsedHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (elapsedMinutes > 0) {
        return `${elapsedMinutes} ${elapsedMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
        return 'Just now';
    }
}

export function handlePrevPage(currentPage, totalPages) {
    if (currentPage > 1) {
        return currentPage - 1;
    }
}

export function handleNextPage(currentPage, totalPages) {
    if (currentPage < totalPages) {
        return currentPage + 1;
    }
}

export function getItemsPerPage() {
    const sidebar = document.querySelector('.sidebar');
    if(sidebar) {
        const sidebarStyle = window.getComputedStyle(sidebar);
        const isSidebarHidden = sidebarStyle.display === 'none';
        const windowWidth = window.innerWidth;
        
        if ( windowWidth <= 750 || (!isSidebarHidden && windowWidth > 750 && windowWidth <= 1150)) {
            return 1; 
        }
        else if ((isSidebarHidden && windowWidth > 750 && windowWidth <= 1250) || (!isSidebarHidden && windowWidth > 1150 && windowWidth <= 1300)) {
            return 2; 
        }
        else if (windowWidth > 1300 && windowWidth <= 1500) {
            return 3;
        }
        else if (windowWidth > 1500 && windowWidth <= 1700) {
            return 4;
        }
        else {
            return 5;
        }
        
    }
}