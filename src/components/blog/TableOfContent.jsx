import React, {useState, useEffect} from 'react';
import {Link} from 'gatsby';
import table from "table";

const TableOfContents = ({html, tableOfContent}) => {

    // useEffect(() => {
    //     console.log(tableOfContents);
    //     console.log(html);
    // }, [tableOfContents]);
    return (
        <aside className="table-of-contents">
            <h3>TABLE OF CONTENTS</h3>
            <nav>
                {<div dangerouslySetInnerHTML={{__html: tableOfContent}}></div>}

            </nav>
        </aside>
    );
};

export default TableOfContents;
