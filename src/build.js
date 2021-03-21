///@author	Hyundai Robototics Co., Ltd. choi, won-hyuk (asoe72@hyundai-robotics.com)
///@brief	project를 읽어 그 구조대로 통합된 book.html을 build하는 기능


const fs = require('fs');
const ejs = require('ejs');
//%%const work = require("./work");


///@param[in]	path	    e.g. "public/works/cmd/" or "cmd"
///@param[in]	prj_name	e.g. "prj_ko"
///@brief	project를 읽어 그 구조대로 책을 묶는다.
exports.buildBook = function(path, prj_name) {
    console.log('buildBook()');

    const out_dir = path;  //%%+ 'out/';
    const body = fs.readFileSync(path + prj_name + '.json', 'utf8');
    //console.log(body);

    const prj = JSON.parse(body);
	
	makeFrontCoverHtml(path, prj.bookinfo);

    // in_body 병합
    var merged_in_body = "";
    const struc = prj.struc;
    struc.forEach(article => {
        merged_in_body += getHtmlFromArticle(path, article);
        //console.log(merged_in_body);
    });

    var html = getHtmlFromMergedInBody(prj.bookinfo, merged_in_body);
    fs.writeFileSync(out_dir + 'book.html', html);

    //console.log(html);
}


///@param[in]	path	    e.g. "public/works/cmd/"
///@return      article의 생성된 in_body html 문자열
function getHtmlFromArticle(path, article)
{
    var file = article.file;
    var in_body = (file) ? getInBodyFromHtmlFile(path, file) : "";

	var h1 = (article.h1) ? `<h1>${article.h1}</h1>` : "";
	var h2 = (article.h2) ? `<h2>${article.h2}</h2>` : "";

    var html = `
			${h1}
			${h2}
            ${in_body}
    `;
    return html;
}


///@param[in]	path	    e.g. "public/works/cmd/"
///@param[in]   rel_pathname    work_dir 기준의 상대 경로파일명
///@return      pathname 파일 내의 <body>...</body>의 ... 부분의 문자열
function getInBodyFromHtmlFile(path, rel_pathname)
{
    const text = fs.readFileSync(path + rel_pathname, 'utf8');
    //console.log(rel_pathname);
    //onsole.log(text.substring(0, 50) + "...");

    const idxSt = text.indexOf('<body>') + '<body>'.length;
    const idxEn = text.lastIndexOf('</body>');
    
    var in_body = text.substring(idxSt, idxEn);
    //console.log(in_body);

    return in_body;
}


///@param[in]   bookinfo
///@param[in]   merged_in_body		article들이 병합된 in_body 문자열
///@return      완전한 html 문서의 문자열
///@brief		template html의 in-body 표식을 merged_in_body로 대체하여
///				head까지 갖춘 완전한 html 문서의 문자열을 리턴한다.
function getHtmlFromMergedInBody(bookinfo, merged_in_body)
{
	const rpathname = 'public/view/book_template.ejs';
	const book_tmpl_ejs = fs.readFileSync(rpathname, 'utf-8');
	const data = { bookinfo: bookinfo, merged_in_body: merged_in_body };
	const tmpl_rendered = ejs.render(book_tmpl_ejs, data
		, { views : [ 'public/view/' ] } );	// for include in .ejs

	return tmpl_rendered;
}


///@param[in]	work_dir	    e.g. public/works/cmd/
///@param[in]	bookinfo
///@brief	front cover template으로 .html 파일 생성
function makeFrontCoverHtml(work_dir, bookinfo)
{
	const out_dir = work_dir;	//%% + 'out/';

	const ftitle = 'book_cover_front';
	const rpathname = `public/view/${ftitle}.ejs`;
	const cover_ejs = fs.readFileSync(rpathname, 'utf-8');
	const data = { bookinfo: bookinfo };
	const cover_rendered = ejs.render(cover_ejs, data
		, { views : [ 'public/view/' ] } );	// for include in .ejs
	console.log(cover_rendered);

	fs.writeFileSync(out_dir + ftitle + ".html", cover_rendered);
}
