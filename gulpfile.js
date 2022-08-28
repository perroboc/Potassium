const gulp = require('gulp');
const fs = require('fs');
const zip = require('gulp-zip');
const del = require('del');
const merge2 = require('merge2');

function clean_task(cb) {
    del([
        'build',
        'dist'
    ])
    .then(function(value) {
        cb();
    });
}

function build_task() {
    return merge2(build_dir('v2'), build_dir('v3'));

}

function build_dir(version) {
    if (version !== 'v2' && version !== 'v3') {
        throw Error('Version is not accepted');
    }
        
    let content_scripts = gulp.src('src/content-scripts/**')
        .pipe(gulp.dest(`build/${version}/content-scripts`));
    let icons = gulp.src('src/icons/**')
        .pipe(gulp.dest(`build/${version}/icons`));
    let lib = gulp.src('src/lib/**')
        .pipe(gulp.dest(`build/${version}/lib`));
    let popup = gulp.src('src/popup/**')
        .pipe(gulp.dest(`build/${version}/popup`));

    return merge2(content_scripts, icons, lib, popup);
};

function package_dir(version) {
    fs.writeFileSync(`build/${version}/manifest.json`, buildManifest(version));
    return gulp.src(`build/${version}/**`)
        .pipe(zip(`potassium_manifest_${version}.zip`, { buffer: false }))
        .pipe(gulp.dest('dist'));
    
};

function package_task(cb) {
    merge2(package_dir('v2', cb), package_dir('v3', cb));
    cb();
};


exports.clean = clean_task;
exports.build = build_task;
exports.package = package_task;
exports.default = gulp.series(clean_task, build_task, package_task);

function buildManifest(manifest_version, cb) {
    const {
        name,
        version,
        description,
        author
    } = require("./package.json");

    const manifest_base = {
        "name": "Potassium: Kindle Enhancer",
        "version": version,
        "description": description,
        "author": author,
        "icons": {
            16: "icons/k+16.png",
            32: "icons/k+32.png",
            48: "icons/k+48.png",
            128: "icons/k+128.png"
        },
        "content_scripts": [
            {
                "matches": [
                    "https://read.amazon.com/manga*"
                ],
                "js": [
                    "lib/common.js",
                    "content-scripts/manga.js"
                ],
                "run_at": "document_start"
            },
            {
                "matches": [
                    "https://read.amazon.com/kindle-library*"
                ],
                "js": [
                    "lib/common.js",
                    "content-scripts/kindle-library.js"
                ],
                "run_at": "document_start"
            }
        ]
    }

    const manifest_v2 = {
        "manifest_version": 2,
        "browser_action": {
            "default_icon": {
                "16": "icons/k+16.png",
                "32": "icons/k+32.png"
            },
            "default_title": "Kindle+",
            "default_popup": "popup/index.html"
        },
        "permissions": [
            "activeTab",
            "https://read.amazon.com/*"
        ],
        "web_accessible_resources": [
            "js/*.js"
        ]
    };

    const manifest_v3 = {
        "manifest_version": 3,
        "action": {
            "default_popup": "popup/index.html"
        },
        "permissions": [
            "activeTab"
        ],
        "host_permissions": [
            "https://read.amazon.com/*"
        ],
        "web_accessible_resources": [
            {
                "resources": [
                    "js/*.js"
                ],
                "matches": [
                    "*://*/*"
                ]
            }
        ]
    };

    if (manifest_version === 'v2') {
        return JSON.stringify(Object.assign(manifest_v2, manifest_base));
    }
    else if (manifest_version === 'v3') {
        return JSON.stringify(Object.assign(manifest_v3, manifest_base));
    }
    else {
        return JSON.stringify({});
    }

}