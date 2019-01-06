module.exports = function(md, config)
{
    md.setStorageBaseDir = function(data)
    {
        md.__baseDir = data;
    }

    var imagedefault = md.renderer.rules.image;

    md.renderer.rules.image = function(tokens, idx, options, env, slf)
    {
        if(md.__baseDir!= undefined)
        {
            var _attrs = tokens[idx].attrs;

            for(var i = 0;i < _attrs.length;i++)
            {
                if(_attrs[i][0] == 'src')
                {
                    let path = _attrs[i][1].trim();

                    if(path.startsWith('storage:'))
                    {
                        var relPath = path.split(":");

                        if(relPath.length == 2)
                        {
                            _attrs[i][1] = md.__baseDir + relPath[1];
                        }
                    }

                    break;
                }
            }
        }
        return imagedefault(tokens, idx, options, env, slf);
    }
}