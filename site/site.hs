{-# LANGUAGE OverloadedStrings #-}
module Main where

import Control.Arrow ((>>>))
import Control.Monad (forM_)

import Hakyll

main :: IO ()
main = hakyll $ do
    -- Compress CSS
    route   "css/*" idRoute
    compile "css/*" compressCssCompiler
    
    -- Read templates
    compile "templates/*" templateCompiler
    
    -- Release archive
    route   "downloads/*" idRoute
    compile "downloads/*" copyFileCompiler
    
    -- Documentation pages
    forM_ [ "index.md"
          , "changelog.md"
          , "downloads.md"
          , "api.md"
          ] $ \page -> do
        route   page $ setExtension ".html"
        compile page $ pageCompiler
            >>> applyTemplateCompiler "templates/default.html"
            >>> relativizeUrlsCompiler
