//@flow

const pathHelper = require('./../../path-helper');
const fs = require('fs-extra');
const path = require('path');
const WorkspaceService = require('./../workspace/workspace-service');
const publisherFactory = require('./../../publishers/publisher-factory');
const siteSourceFactory = require('./../../site-sources/site-source-factory');

/*::
    import type { SiteConfig, WorkspaceHeader } from './../../../global-types';
*/



class SiteService{
    /*::
        _config: SiteConfig;
    */
    constructor(config/*: SiteConfig*/){
        this._config = config;
    }

    _getSiteSource(){
        return siteSourceFactory.get(this._config.key, this._config.source);
    }

    //List all workspaces
    async listWorkspaces()/*: Promise<Array<WorkspaceHeader>>*/{
        return this._getSiteSource().listWorkspaces();
    }

    async getWorkspaceHead(workspaceKey/*: string*/)/*: Promise<?WorkspaceHeader>*/{
        return (await this.listWorkspaces())
            .find(x => x.key===workspaceKey);
    }

    async mountWorkspace(workspaceKey/*: string*/)/*: Promise<void>*/{
        await this._getSiteSource().mountWorkspace(workspaceKey);
    }

    _findFirstMatchOrDefault/*::<T: any>*/(arr/*: Array<T>*/, key/*: string*/)/*: T*/{
        let result;
        
        if(key){
            result = (arr||[]).find(x => x.key===key);
            if(result) return result;
        }

        result = (arr||[]).find(x => x.key==='default'|| x.key==='' || x.key==null);
        if(result) return result;

        if(arr!==undefined && arr.length===1)
            return arr[0];
        
        if(key){
            throw new Error(`Could not find a config for key "${key}" and a default value was not available.`);
        }
        else{
            throw new Error(`Could not find a default config.`);
        }
    }

    publish(publishKey/*: string*/)/*: Promise<void>*/{
        
        let publishConfig = this._findFirstMatchOrDefault(this._config.publish, publishKey);
        if(publishConfig==null)
            throw new Error(`Could not find a publisher config for key '${publishKey}'.`);
        if(publishConfig.config==null)
            throw new Error(`The matcher publisher config does not have a property config.`);

        let from = pathHelper.getLastBuildDir();
        if(from==null)
            throw new Error('Could not resolve the last build directory.');

        let publisher = publisherFactory.getPublisher(publishConfig.config);
        return publisher.publish({siteKey: this._config.key, publishKey, from });
    }
}

module.exports = SiteService;