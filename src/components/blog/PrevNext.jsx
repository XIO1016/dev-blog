import React, {useEffect} from 'react';

const PrevNext = ({prev, next, prevTitle, nextTitle}) => {

    useEffect(() =>{
        console.log('prev:', prev)
        console.log('next:', next)
    },[prev,next])
    return (
        <div className="prev-next-wrapper">
            <div className="logo-wrapper prev-wrapper">
                { next ? (
                    <a href={`/articles/${next}`}>
                        <div className="logo">
                            <div className="text-gray-500">Previous Post</div>
                            <div className="text-black">{nextTitle}</div>
                        </div>
                    </a>
                ) : (
                    <a href="/blog">
                        <div className="logo">
                            <div className="text-gray-500">No Previous Post</div>
                            <div className="text-black">홈으로 돌아가기</div>
                        </div>
                    </a>
                )}
            </div>
            <div className="logo-wrapper next-wrapper">
                {prev ? (
                    <a href={`/articles/${prev}`}>
                        <div className="logo">
                            <div className="next">
                                <div className="text-gray-500">Next Post</div>
                                <div className="text-black">{prevTitle}</div>
                            </div>
                        </div>
                    </a>
                ) : (
                    <a href="/">
                        <div className="logo">
                            <div className="next">
                                <div className="text-gray-500">No Next Post</div>
                                <div className="text-black">홈으로 돌아가기</div>
                            </div>
                        </div>
                    </a>
                )}
            </div>
        </div>
    );
};

export default PrevNext;
